import { Store, EventBus, DataRouter } from "wx-lib-state";
import type { TDataConfig, TWritableCreator, TID } from "wx-lib-state";
import { getValue, setValue } from "./editors";
import { download, getRenderValue } from "./export";
import { getCsvData } from "./export/csv";
import { getExcelData, getExportStyles } from "./export/excel";

import type {
	IColumn,
	IRenderColumn,
	IData,
	IDataConfig,
	IRenderHeaderConfig,
	IRow,
	TMethodsConfig,
	TSortConfig,
	ISizeConfig,
	IRenderSizes,
	IExportOptions,
	TColumnType,
	TSortValue,
	TExportStyles,
} from "./types";
import { sortByMany } from "./sort";
import {
	getHeaderFooterHeights,
	getColumnWidth,
	getHeaderColWidth,
	suggestSkin,
} from "./sizes";

export default class DataStore extends Store<IData> {
	public in: EventBus<TMethodsConfig, keyof TMethodsConfig>;
	private _router: DataRouter<IData, IDataConfig, TMethodsConfig>;
	private _branches: { [key: TID]: IRow };
	private _xlsxWorker: any;

	constructor(w: TWritableCreator) {
		super({ writable: w, async: false });

		const defaultSizes = {
			rowHeight: 37,
			colWidth: 160,
			headerHeight: 36,
			footerHeight: 36,
		};

		this._router = new DataRouter(
			super.setState.bind(this),
			// data recalculation dependencies
			[
				// normalize columns, headers and footers
				{
					in: ["columns", "sizes", "_skin"],
					out: ["_columns", "_sizes"],
					exec: (ctx: TDataConfig) => {
						const { columns, sizes, _skin } = this.getState();
						const _columns: IRenderColumn[] =
							this.copyColumns(columns);

						const headerRowCount = _columns.reduce(
							(a, b) => Math.max(b.header.length, a),
							0
						);
						const footerRowCount = _columns.reduce(
							(a, b) => Math.max(b.footer.length, a),
							0
						);

						_columns.forEach(this.setCollapsibleColumns);

						const _sizes: IRenderSizes = this.normalizeSizes(
							_columns,
							sizes,
							headerRowCount,
							footerRowCount,
							_skin
						);

						_columns.forEach((col, i) => {
							this.normalizeColumns(
								_columns,
								i,
								"header",
								headerRowCount,
								_sizes
							);
							this.normalizeColumns(
								_columns,
								i,
								"footer",
								footerRowCount,
								_sizes
							);
						});

						this.setState({ _columns, _sizes }, ctx);
					},
				},
				{
					in: ["data", "tree"],
					out: ["flatData"],
					exec: (ctx: TDataConfig) => {
						const { data, tree } = this.getState();
						this.setState(
							{ flatData: tree ? this.flattenRows(data) : data },
							ctx
						);
					},
				},
			],
			{
				// data initializers
				sizes: (v: ISizeConfig) => ({ ...defaultSizes, ...v }),
			}
		);

		const inBus = (this.in = new EventBus());

		inBus.on(
			"close-editor",
			({ ignore }: IDataMethodsConfig["close-editor"]) => {
				const { editor } = this.getState();
				if (editor) {
					if (!ignore) {
						inBus.exec("update-cell", editor);
					}
					this.setState({ editor: null });
				}
			}
		);
		inBus.on(
			"open-editor",
			({ id, column }: IDataMethodsConfig["open-editor"]) => {
				let editor = this.getState().editor;
				if (editor) inBus.exec("close-editor", {});

				const col = column
					? this.getColumn(column)
					: this.getNextEditor();
				if (col?.editor) {
					const row = this.getRow(id);

					editor = {
						column: col.id,
						id,
						value: getValue(row, col),
						renderedValue: getRenderValue(row, col),
					};

					if (typeof col.editor !== "string" && col.editor.config) {
						editor.config = col.editor.config;
					}
					if (col.options) editor.options = col.options;
					this.setState({ editor });
				}
			}
		);
		inBus.on("editor", ({ value }: IDataMethodsConfig["editor"]) => {
			const editor = this.getState().editor;
			if (editor) {
				editor.value = value;
				this.setState({ editor });
			}
		});
		inBus.on("add-row", (ev: IDataMethodsConfig["add-row"]) => {
			let { data } = this.getState();
			const { row, before, after } = ev;
			ev.id = row.id = ev.id || row.id || uid();

			if (before || after) {
				const id = before || after;
				const index = data.findIndex(a => a.id === id);
				data.splice(index + (after ? 1 : 0), 0, ev.row);
				data = [...data];
			} else {
				data = [...data, ev.row];
			}

			this.setState({ data });

			inBus.exec("select-row", { id: row.id });
		});
		inBus.on("delete-row", (ev: IDataMethodsConfig["delete-row"]) => {
			const { data, selectedRows } = this.getState();
			const { id } = ev;

			const update: Partial<IData> = {
				data: data.filter(a => a.id !== id),
			};
			if (this.isSelected(id)) {
				update.selectedRows = selectedRows.filter(a => a !== id);
			}

			this.setState(update);
		});
		inBus.on("update-cell", (ev: IDataMethodsConfig["update-cell"]) => {
			let { data } = this.getState();
			data = [...data];

			const { tree } = this.getState();
			const { id, column, value } = ev;

			const col = this.getColumn(column);

			if (tree) {
				const row = this._branches[id];
				const obj = { ...row };
				setValue(obj, col, value);

				// we need not recreate all data objects, as rendering layer doesn't work
				// with the hierarchy, just need to update the object itself and its references
				this._branches[id] = obj;
				// update in parent collection
				const parentRow = this._branches[obj.$parent];
				const parentIndex = parentRow.data.findIndex(
					(a: IRow) => a.id == id
				);

				parentRow.data = [...parentRow.data];
				parentRow.data[parentIndex] = obj;

				if (obj.$parent === 0) {
					data = parentRow.data;
				}
			} else {
				const index = data.findIndex(a => a.id == id);
				const obj = { ...data[index] };
				setValue(obj, col, value);

				data[index] = obj;
			}

			this.setState({ data });
		});
		inBus.on("update-row", (ev: IDataMethodsConfig["update-row"]) => {
			let { data } = this.getState();
			const { id, row } = ev;

			const index = data.findIndex(a => a.id == id);
			data = [...data];
			data[index] = { ...data[index], ...row };
			this.setState({ data });
		});
		inBus.on(
			"select-row",
			({
				id,
				toggle,
				range,
				mode,
				show,
				column,
			}: IDataMethodsConfig["select-row"]) => {
				let { selectedRows } = this.getState();

				if (!selectedRows.length) range = toggle = false;

				if (range) {
					const { data } = this.getState();

					let sindex = data.findIndex(
						a => a.id == selectedRows[selectedRows.length - 1]
					);
					let eindex = data.findIndex(a => a.id == id);
					if (sindex > eindex) [sindex, eindex] = [eindex, sindex];

					data.slice(sindex, eindex + 1).forEach(a => {
						if (selectedRows.indexOf(a.id) === -1)
							selectedRows.push(a.id);
					});
				} else if (toggle && this.isSelected(id)) {
					if (mode === true) return;
					selectedRows = selectedRows.filter(a => a !== id);
				} else {
					if (toggle) {
						if (mode === false) return;
						selectedRows.push(id);
					} else selectedRows = [id];
				}
				this.setState({ selectedRows });

				if (show) this.in.exec("scroll", { row: id, column });
			}
		);
		inBus.on("resize-column", (ev: IDataMethodsConfig["resize-column"]) => {
			const { id, auto, maxRows } = ev;
			let width = ev.width || 0;
			const columns = [...this.getState().columns];
			const column = columns.find(a => a.id == id);

			if (auto) {
				if (auto == "data" || auto === true) {
					const { flatData, _skin } = this.getState();
					let max = flatData.length;

					if (maxRows) max = Math.min(maxRows, max);

					const curData = flatData.slice(0, max);
					width = getColumnWidth(column, curData, _skin);
				}

				if (auto == "header" || auto === true) {
					const { _skin } = this.getState();

					width = Math.max(getHeaderColWidth(column, _skin), width);
				}
			}

			column.width = Math.max(17, width);
			delete column.flexgrow;
			this.setState({ columns });
		});
		inBus.on(
			"hide-column",
			({ id, mode }: IDataMethodsConfig["hide-column"]) => {
				const columns = [...this.getState().columns];
				const column = columns.find(a => a.id == id);
				const visibleColumns = columns.reduce(
					(p, v) => p + (v.hidden ? 0 : 1),
					0
				);
				if (!mode || visibleColumns > 1) {
					column.hidden = !column.hidden;
					this.setState({ columns });
				}
			}
		);
		inBus.on("sort-rows", (ev: IDataMethodsConfig["sort-rows"]) => {
			const sortBy: TSortConfig = {
				key: ev.key,
				order: ev.order || "asc",
			};
			const state = this.getState();
			let sort = state.sort;
			const { columns, data, tree } = this.getState();

			let index = sort.length;
			sort.forEach((a, i) => {
				if (a.key === sortBy.key) {
					sortBy.order = a.order === "asc" ? "desc" : "asc";
					index = i;
				}
			});

			columns.forEach(a => {
				a.$sort = null;
			});

			if (!ev.add) {
				sort = [sortBy];
			} else {
				sort = [...sort];
				sort[index] = sortBy;
			}
			this.setState({ sort });

			sort.forEach((x, i) => {
				x.index = sort.length === 1 ? 0 : i + 1;
				columns.find(a => a.id == x.key).$sort = x;
			});
			this.setState({ columns });

			const sorter = sortByMany(sort);
			if (sorter) {
				const nextData = [...data];

				if (tree) {
					this.sortTree(nextData, sorter);
				} else nextData.sort(sorter);

				this.setState({ data: nextData });
			}
		});

		inBus.on("filter-rows", (ev: IDataMethodsConfig["filter-rows"]) => {
			this.setState({ filter: ev.handler });
		});

		inBus.on(
			"collapse-column",
			(ev: IDataMethodsConfig["collapse-column"]) => {
				const { id, row, mode } = ev;
				const columns = [...this.getState().columns];
				const header = this.getColumn(id).header;
				const cell = Array.isArray(header) ? header[row] : header;

				if (typeof cell === "object") {
					cell.collapsed = mode ?? !cell.collapsed;
					this.setState({ columns });
				}
			}
		);

		inBus.on("open-row", (ev: IDataMethodsConfig["open-row"]) => {
			const { id, nested } = ev;
			const { data } = this.getState();
			this.toggleBranch(id, true, nested);
			this.setState({ data });
		});

		inBus.on("close-row", (ev: IDataMethodsConfig["close-row"]) => {
			const { id, nested } = ev;
			const { data } = this.getState();
			this.toggleBranch(id, false, nested);
			this.setState({ data });
		});
		inBus.on("hotkey", ({ key, event }: IDataMethodsConfig["hotkey"]) => {
			switch (key) {
				case "arrowup": {
					const {
						selectedRows,
						editor,
						flatData: data,
					} = this.getState();

					if (!editor) {
						event.preventDefault();
						const selected = selectedRows[0];
						const id = selected
							? this.getPrevRow(selected)?.id
							: data[data.length - 1]?.id;
						if (id) {
							this.in.exec("select-row", { id, show: true });
						}
					}
					break;
				}
				case "arrowdown": {
					const {
						selectedRows,
						editor,
						flatData: data,
					} = this.getState();
					if (!editor) {
						event.preventDefault();
						const selected = selectedRows[0];
						const id = selected
							? this.getNextRow(selected)?.id
							: data[0]?.id;
						if (id) {
							this.in.exec("select-row", { id, show: true });
						}
					}
					break;
				}
				case "tab": {
					const { editor } = this.getState();
					if (editor) {
						event.preventDefault();

						const column = editor.column;
						let id = editor.id;
						let col = this.getNextEditor(column);
						if (!col) {
							const row = this.getNextRow(id);
							if (row) {
								id = row.id;
								col = this.getNextEditor();
								this.in.exec("select-row", {
									id,
									show: true,
									column: col.id,
								});
							}
						} else {
							this.in.exec("select-row", {
								id,
								show: true,
								column: col.id,
							});
						}

						if (col)
							this.in.exec("open-editor", {
								id,
								column: col.id,
							});
					}
					break;
				}
				case "shift+tab": {
					const { editor } = this.getState();
					if (editor) {
						event.preventDefault();

						const column = editor.column;
						let id = editor.id;
						let col = this.getPrevEditor(column);
						if (!col) {
							const row = this.getPrevRow(id);
							if (row) {
								id = row.id;
								col = this.getPrevEditor();
								this.in.exec("select-row", {
									id,
									show: true,
									column: col.id,
								});
							}
						} else {
							this.in.exec("select-row", {
								id,
								show: true,
								column: col.id,
							});
						}

						if (col)
							this.in.exec("open-editor", {
								id,
								column: col.id,
							});
					}
					break;
				}
				case "escape": {
					const { editor } = this.getState();
					if (editor) {
						this.in.exec("close-editor", { ignore: true });
					}
					break;
				}
				case "f2": {
					const { editor, selectedRows } = this.getState();
					if (!editor && selectedRows.length) {
						this.in.exec("open-editor", { id: selectedRows[0] });
					}
					break;
				}
			}
		});

		inBus.on("scroll", (ev: IDataMethodsConfig["scroll"]) => {
			const { _columns, split, _sizes, data, dynamic } = this.getState();

			let left = -1,
				top = -1,
				width = 0;
			if (ev.column) {
				left = 0;
				const ind = _columns.findIndex(a => a.id === ev.column);
				width = _columns[ind].width;
				for (let i = split.left; i < ind; i++) {
					const col = _columns[i];
					if (col.hidden) continue;
					left += col.width;
				}
			}
			if (ev.row && !dynamic) {
				const index = data.findIndex(a => a.id === ev.row);
				if (index >= 0)
					top =
						_sizes.rowHeight * data.findIndex(a => a.id === ev.row);
			}

			this.setState({
				scroll: {
					top,
					left,
					width,
					height: _sizes.rowHeight,
				},
			});
		});
	}

	private getXlsxWorker(path: string): Promise<any> {
		if (!this._xlsxWorker) {
			const url = window.URL.createObjectURL(
				new Blob([`importScripts('${path}');`], {
					type: "text/javascript",
				})
			);

			this._xlsxWorker = new Promise(res => {
				const xlsxWorker = new Worker(url);
				xlsxWorker.addEventListener("message", e => {
					if (e.data.type === "init") res(xlsxWorker);
				});
			});
		}
		return this._xlsxWorker;
	}

	init(state: Partial<IDataConfig>) {
		// eslint-disable-next-line no-prototype-builtins
		if (state.hasOwnProperty("_skin") && !(state as IData)._skin) {
			(state as IData)._skin = suggestSkin();
		}
		if (state.columns)
			state.columns.forEach(a => {
				if (a.options) {
					a.optionsMap = new Map(a.options.map(x => [x.id, x.label]));
				}
			});

		if (state.tree) {
			this._branches = { 0: { data: state.data } };
			state.data = this.normalizeTreeRows(state.data);
		} else state.data = this.normalizeRows(state.data);

		this._router.init({
			sort: [],
			filter: null,
			scroll: null,
			editor: null,
			...state,
		});
	}

	setState(state: Partial<IData>, ctx?: TDataConfig) {
		return this._router.setState(state, ctx);
	}

	getRow(id: TID): IRow {
		const { tree } = this.getState();
		if (tree) return this._branches[id];
		return this.getState().data.find(a => a.id == id);
	}

	getNextRow(id: TID): IRow {
		const data = this.getState().flatData;
		const index = data.findIndex((r: IRow) => r.id == id);
		return data[index + 1];
	}

	getPrevRow(id: TID): IRow {
		const data = this.getState().flatData;
		const index = data.findIndex((o: IRow) => o.id == id);
		return data[index - 1];
	}

	getColumn(id: TID): IColumn {
		return this.getState().columns.find(a => a.id == id);
	}

	getNextEditor(id?: TID): IColumn {
		let columns = this.getState().columns;
		if (id) {
			const index = columns.findIndex(c => c.id == id);
			columns = columns.slice(index + 1);
		}
		return columns.find(c => c.editor && !c.hidden);
	}

	getPrevEditor(id?: TID): IColumn {
		let columns = this.getState().columns;
		if (id) {
			const index = columns.findLastIndex(c => c.id == id);
			columns = columns.slice(0, index);
		}
		return columns.findLast(c => c.editor && !c.hidden);
	}

	toggleBranch(id: TID, open: boolean, nested?: boolean) {
		const item = this._branches[id];
		if (id !== 0) {
			item.open = open;
		}

		if (nested && item.data?.length) {
			item.data.forEach((row: IRow) => {
				this.toggleKids(row, open, nested);
			});
		}
	}

	toggleKids(item: IRow, open: boolean, nested?: boolean) {
		item.open = open;

		if (nested && item.data?.length) {
			item.data.forEach((row: IRow) => {
				this.toggleKids(row, open, nested);
			});
		}
	}

	private isSelected(id: TID): boolean {
		return this.getState().selectedRows.indexOf(id) !== -1;
	}

	private copyColumns(columns: IColumn[]) {
		const _columns: IRenderColumn[] = [];
		columns.forEach(col => {
			const copy = { ...col } as IRenderColumn;
			this.copyHeaderFooter(copy, "header");
			this.copyHeaderFooter(copy, "footer");
			_columns.push(copy);
		});
		return _columns;
	}

	private copyHeaderFooter(col: IColumn, type: TColumnType) {
		let config: any = col[type];

		config = Array.isArray(config) ? [...config] : [config];
		config.forEach((text: any, i: number) => {
			config[i] = typeof text === "string" ? { text } : { ...text };
		});

		col[type] = config;
	}

	private setCollapsibleColumns(
		col: IRenderColumn,
		index: number,
		columns: IRenderColumn[]
	) {
		let header = col.header;
		for (let r = 0; r < header.length; r++) {
			const cell = header[r];

			if (cell.collapsible && cell.collapsed) {
				if (cell.collapsible !== "first") {
					col.collapsed = true;
					col.width = 36;
					cell.vertical = true;

					const diff = header.length - r;
					header = header.slice(0, r + 1);
					header[r].rowspan = diff;
				}

				const colspan = cell.colspan;
				if (colspan) {
					const nextCell = header[r + 1];
					let spanStart = 1;

					if (nextCell && nextCell.colspan && !nextCell.collapsed) {
						spanStart = nextCell.colspan;
					}

					for (let span = spanStart; span < colspan; span++) {
						const curCol = columns[index + span];
						if (curCol) {
							curCol.hidden = true;
						}
					}
				}
			}
		}
	}

	private normalizeColumns(
		columns: IRenderColumn[],
		index: number,
		type: TColumnType,
		rowsCount: number,
		sizes: IRenderSizes
	) {
		const col = columns[index];
		if (!col.width) col.width = col.flexgrow ? 17 : sizes.colWidth;

		if (col.editor && typeof col.editor === "string") {
			col.editor = { type: col.editor };
		}

		// normalize header and footer config
		const config: IRenderHeaderConfig[] = col[type];
		const rowHeights = sizes[`${type}RowHeights`];

		for (let i = 0; i < rowsCount; i++) {
			const row: IRenderHeaderConfig = config[i];

			row.id = col.id;

			// stretch cells with no rowspan to fit available space or cut rowspan if it was set incorrectly
			if (i === config.length - 1) {
				row.rowspan = row.rowspan
					? Math.min(row.rowspan, rowsCount - i)
					: rowsCount - i;
			}

			// fill space covered by rowspans with empties so that rows are rendered column by column regardless of upper row overlap
			for (let r = 1; r < row.rowspan; r++) {
				(config as any).splice(i + r, 0, {});
				// fill neighboring columns as well for headers with colspans and rowspans
				for (let c = 1; c < row.colspan; c++) {
					const nextColRows = columns[index + c][type];
					(nextColRows as any[]).splice(i + r, 0, {});
				}
			}

			if (row.rowspan) {
				const rHeights =
					row.rowspan === rowsCount
						? rowHeights
						: rowHeights.slice(i, row.rowspan + i);
				const height = rHeights.reduce((a, b) => a + b, 0);
				row.height = height;
				if (i + row.rowspan != rowsCount) row.height--; // -1px because of row border-bottom
			}

			// set widths for header cells
			if (row.colspan) {
				let width = col.width;
				let flexgrow = col.flexgrow || 0;
				const colspan = row.colspan;
				for (let span = 1; span < colspan; span++) {
					const curCell = columns[index + span];
					if (curCell) {
						if (curCell.hidden) {
							row.colspan -= 1;
						} else if (curCell.flexgrow) {
							flexgrow += curCell.flexgrow;
						} else {
							width += curCell.width || sizes.colWidth;
						}
					}
					if (flexgrow) {
						row.flexgrow = flexgrow;
					} else {
						row.width = width;
					}
				}
			} else {
				row.width = col.width;
				row.flexgrow = col.flexgrow;
			}
		}

		if (config.length > rowsCount) config.length = rowsCount;
		col[type] = config;

	}

	normalizeRows(data: IRow[]): IRow[] {
		data.forEach(row => {
			if (!row.id) row.id = uid();
		});
		return data;
	}

	normalizeTreeRows(data: IRow[], level?: number, parent?: TID): IRow[] {
		data.forEach(row => {
			if (!row.id) row.id = uid();

			row.$level = level || 0;
			row.$parent = parent || 0;

			this._branches[row.id] = row;

			if (row.data?.length) {
				row.$count = row.data.length;
				this.normalizeTreeRows(row.data, row.$level + 1, row.id);
			}
		});
		return data;
	}

	sortTree(data: any[], sorter: (a: TSortValue, b: TSortValue) => number) {
		data.sort(sorter);
		data.forEach(item => {
			if (item.data) {
				this.sortTree(item.data, sorter);
			}
		});
	}

	flattenRows(data: IRow[], flatData?: IRow[]): IRow[] {
		const res: IRow[] = flatData || [];
		data.forEach(row => {
			res.push(row);
			if (row.data?.length && row.open !== false) {
				this.flattenRows(row.data, res);
			}
		});
		return res;
	}

	private normalizeSizes(
		columns: IRenderColumn[],
		sizes: ISizeConfig,
		headerRowCount: number,
		footerRowCount: number,
		skin: string
	): IRenderSizes {
		const headerRowHeights = getHeaderFooterHeights(
			columns,
			"header",
			headerRowCount,
			sizes.headerHeight,
			skin
		);
		const footerRowHeights = getHeaderFooterHeights(
			columns,
			"footer",
			footerRowCount,
			sizes.footerHeight,
			skin
		);

		// need to recalculate header/footer height if header has rows or vertical text
		const headerHeight = headerRowHeights.reduce((a, b) => a + b, 0);
		const footerHeight = footerRowHeights.reduce((a, b) => a + b, 0);

		return {
			...sizes,
			headerRowHeights,
			footerRowHeights,
			headerHeight,
			footerHeight,
		};
	}
}

let base = new Date().valueOf();
function uid() {
	return "temp://" + base++;
}

export interface IDataMethodsConfig {
	["update-cell"]: {
		id: TID;
		column: TID;
		value: string | number | Date;
	};
	["add-row"]: {
		id?: TID;
		before?: TID;
		after?: TID;
		row: IRow;
	};
	["delete-row"]: { id: TID };
	["update-row"]: { id: TID; row: Record<string, any> };
	["select-row"]: {
		id: TID;
		toggle?: boolean;
		range?: boolean;
		mode?: boolean;
		show?: boolean;
		column?: TID;
	};
	["resize-column"]: {
		id: TID;
		width?: number;
		auto?: boolean | "data" | "header";
		maxRows?: number;
	};
	["hide-column"]: { id: string; mode: boolean };
	["sort-rows"]: {
		key: string;
		order?: string;
		add?: boolean;
	};

	["open-editor"]: {
		id: string;
		column?: string;
	};
	["close-editor"]: {
		ignore?: boolean;
	};
	["editor"]: {
		value: any;
	};

	["filter-rows"]: {
		handler: any;
	};

	["collapse-column"]: {
		id: TID;
		row: number;
		mode?: boolean;
	};

	["open-row"]: {
		id: TID;
		nested?: boolean;
	};
	["close-row"]: {
		id: TID;
		nested?: boolean;
	};
	["export"]: {
		options: IExportOptions;
		result: any;
	};

	["scroll"]: {
		row?: TID;
		column?: TID;
	};

	["hotkey"]: {
		key: string;
		event: any;
		isInput: boolean;
	};
}
