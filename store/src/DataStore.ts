import { Store, EventBus, DataRouter, isSame } from "wx-lib-state";
import type { TDataConfig, TWritableCreator, TID } from "wx-lib-state";
import { getValue, setValue } from "./editors";
import { download, getRenderValue } from "./export";
import { getCsvData } from "./export/csv";
import { getExcelData, getExportStyles } from "./export/excel";
import { normalizePrintConfig } from "./print";
import { HistoryManager } from "./HistoryManager";
import { isCommunity } from "./package";

import type {
	IColumn,
	IRenderColumn,
	IData,
	IDataConfig,
	IRenderHeaderConfig,
	IRow,
	TMethodsConfig,
	ISizeConfig,
	IRenderSizes,
	IExportOptions,
	TColumnType,
	TSortValue,
	IDataHash,
	IFilterValues,
	IPrintConfig,
} from "./types";
import { sortByMany } from "./sort";
import {
	getHeaderFooterHeights,
	getColumnWidth,
	getHeaderColWidth,
	suggestSkin,
} from "./sizes";
import { getFilterHandler } from "./filters";

export default class DataStore extends Store<IData> {
	public in: EventBus<TMethodsConfig, keyof TMethodsConfig>;
	private _router: DataRouter<IData, IDataConfig, TMethodsConfig>;
	private _branches: { [key: TID]: IRow };
	private _xlsxWorker: any;
	private _historyManager: HistoryManager;

	constructor(w: TWritableCreator) {
		super({ writable: w, async: false });

		const defaultSizes = {
			rowHeight: 37,
			columnWidth: 160,
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
					in: ["data", "tree", "_filterIds"],
					out: ["flatData"],
					exec: (ctx: TDataConfig) => {
						const {
							data,
							tree,
							_filterIds: filterIds,
						} = this.getState();
						const flatData = tree
							? this.flattenRows(data, [], filterIds)
							: data.filter(
									d => !filterIds || filterIds.includes(d.id)
								);
						this.setState({ flatData }, ctx);
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

				const row = this.getRow(id);
				const col = column
					? this.getColumn(column)
					: this.getNextEditor(row);

				if (col?.editor) {
					let columnEditor = col.editor;
					if (typeof columnEditor === "function")
						columnEditor = columnEditor(row, col);
					if (!columnEditor) return;

					editor = {
						column: col.id,
						id,
						value: getValue(row, col) ?? "",
						renderedValue: getRenderValue(row, col),
					};

					if (
						typeof columnEditor === "object" &&
						columnEditor.config
					) {
						editor.config = columnEditor.config;
						if (columnEditor.config.options)
							editor.options = columnEditor.config.options;
					}

					if (col.options && !editor.options)
						editor.options = col.options;

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
			const state = this.getState();
			let { data } = state;
			const { _select: select, _filterIds: filterIds } = state;
			const { row, before, after, select: selectForce } = ev;
			ev.id = row.id = ev.id || row.id || uid();

			if (before || after) {
				const id = before || after;
				const index = data.findIndex(a => a.id === id);
				data.splice(index + (after ? 1 : 0), 0, ev.row);
				data = [...data];
			} else {
				data = [...data, ev.row];
			}

			const update: Partial<IData> = { data };

			if (filterIds) update._filterIds = [...filterIds, ev.id];

			this.setState(update);

			if (typeof selectForce === "boolean" && !selectForce) return;
			if (selectForce || select)
				inBus.exec("select-row", { id: row.id, show: true });
		});
		inBus.on("delete-row", (ev: IDataMethodsConfig["delete-row"]) => {
			const { data, selectedRows, focusCell } = this.getState();
			const { id } = ev;

			const update: Partial<IData> = {
				data: data.filter(a => a.id !== id),
			};

			if (this.isSelected(id)) {
				update.selectedRows = selectedRows.filter(a => a !== id);
			}

			this.setState(update);

			if (focusCell?.row === id) {
				this.in.exec("focus-cell", { eventSource: "delete-row" });
			}
		});
		inBus.on("update-cell", (ev: IDataMethodsConfig["update-cell"]) => {
			const state = this.getState();
			let { data } = state;
			data = [...data];

			const { tree } = state;
			const { id, column, value } = ev;

			const col = this.getColumn(column);

			if (tree) {
				const obj = { ...this._branches[id] };
				setValue(obj, col, value);

				const update = this.updateTreeRow(obj);
				if (obj.$parent === 0) {
					data = update;
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
				const state = this.getState();
				const { focusCell } = state;
				let { selectedRows } = state;

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

				if (focusCell?.row !== id) {
					this.in.exec("focus-cell", { eventSource: "select-row" });
				}
				if (show) this.in.exec("scroll", { row: id, column });
			}
		);
		this.in.on("focus-cell", (ev: IDataMethodsConfig["focus-cell"]) => {
			const { row, column, eventSource } = ev;
			const { _columns, split } = this.getState();

			if (row && column) {
				this.setState({ focusCell: { row, column } });
				if (eventSource !== "click") {
					if (
						(!split.left ||
							_columns.findIndex(a => a.id == ev.column) >=
								split.left) &&
						(!split.right ||
							_columns.findIndex(a => a.id == ev.column) <
								_columns.length - split.right)
					) {
						this.in.exec("scroll", { row, column });
					} else this.in.exec("scroll", { row });
				}
			} else this.setState({ focusCell: null });
		});
		inBus.on("resize-column", (ev: IDataMethodsConfig["resize-column"]) => {
			const { id, auto, maxRows, inProgress } = ev;
			if (inProgress === false) {
				// event called with inProgress=false is purely informational (indicates that the resize is over)
				return;
			}
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
		inBus.on("hide-column", (ev: IDataMethodsConfig["hide-column"]) => {
			const { id, mode } = ev;
			const columns = [...this.getState().columns];
			const column = columns.find(a => a.id == id);
			const visibleColumns = columns.reduce(
				(p, v) => p + (v.hidden ? 0 : 1),
				0
			);
			if (!mode || visibleColumns > 1) {
				column.hidden = !column.hidden;
				this.setState({ columns });
			} else ev.skipUndo = true;
		});
		inBus.on("sort-rows", (ev: IDataMethodsConfig["sort-rows"]) => {
			const { key, add } = ev;
			let { order = "asc" } = ev;

			const state = this.getState();
			let sortMarks = state.sortMarks;
			const { columns, data, tree } = state;
			const fields = Object.keys(sortMarks);
			const fLength = fields.length;

			if (sortMarks[key])
				order = sortMarks[key].order === "asc" ? "desc" : "asc";

			if (!add || !fLength || (fLength === 1 && sortMarks[key])) {
				sortMarks = { [key]: { order } };
			} else {
				if (fLength === 1) {
					// ensure the first sort field has an index for proper ordering
					sortMarks[fields[0]] = {
						...sortMarks[fields[0]],
						index: 0,
					};
				}
				sortMarks = {
					...sortMarks,
					[key]: {
						order,
						index: sortMarks[key]?.index ?? fLength,
					},
				};
			}

			const sortArr = Object.keys(sortMarks)
				.sort((a, b) => sortMarks[a].index - sortMarks[b].index)
				.map(k => ({ key: k, order: sortMarks[k].order }));

			this.setState({ sortMarks });

			const sorter = sortByMany(sortArr, columns);
			if (sorter) {
				const nextData = [...data];

				if (tree) {
					this.sortTree(nextData, sorter);
				} else nextData.sort(sorter);

				this.setState({ data: nextData });
			}
		});

		inBus.on("filter-rows", (ev: IDataMethodsConfig["filter-rows"]) => {
			const { value, key, filter } = ev;

			// clear all filters
			if (!Object.keys(ev).length) {
				this.setState({ filterValues: {}, _filterIds: null });
				return;
			}

			const state = this.getState();
			const { data, tree } = state;
			let filterValues = state.filterValues;

			const update: Partial<IData> = {};
			if (key) {
				filterValues = {
					...filterValues,
					[key]: value,
				};
				update.filterValues = filterValues;
			}

			const filterFn = filter ?? this.createFilter(filterValues);

			let filterIds: TID[] = [];
			if (tree) {
				filterIds = this.filterTree(data, filterFn, filterIds);
			} else
				data.forEach(d => {
					if (filterFn(d)) filterIds.push(d.id);
				});
			update._filterIds = filterIds;

			this.setState(update);
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

		inBus.on("move-item", (ev: IDataMethodsConfig["move-item"]) => {
			const { id, target, mode = "after", inProgress } = ev;
			const { data, flatData, tree } = this.getState();
			const sourceIndex = flatData.findIndex(a => a.id == id);
			const targetIndex = flatData.findIndex(a => a.id == target);

			if (
				sourceIndex === -1 ||
				targetIndex === -1 ||
				inProgress === false
			) {
				// event called with inProgress=false is purely informational (indicates that the drag is over)
				return;
			}

			let updatedData;
			if (tree) {
			} else {
				updatedData = this.moveItem(id, target, data, mode);
			}

			this.setState({
				data: tree ? this.normalizeTreeRows(updatedData) : updatedData,
			});
		});

		inBus.on("open-row", (ev: IDataMethodsConfig["open-row"]) => {
			const { id, nested } = ev;
			this.toggleBranch(id, true, nested);
		});

		inBus.on("close-row", (ev: IDataMethodsConfig["close-row"]) => {
			const { id, nested } = ev;
			this.toggleBranch(id, false, nested);
		});
		inBus.on(
			"hotkey",
			({ key, event, isInput }: IDataMethodsConfig["hotkey"]) => {
				switch (key) {
					case "arrowup": {
						const {
							flatData: data,
							focusCell,
							_select: select,
						} = this.getState();
						event.preventDefault();
						if (isInput) return;

						const colId = focusCell
							? focusCell.column
							: this._getFirstVisibleColumn()?.id;
						const rowId = focusCell
							? this.getPrevRow(focusCell.row)?.id
							: data[data.length - 1]?.id;
						if (colId && rowId) {
							this.in.exec("focus-cell", {
								row: rowId,
								column: colId,
								eventSource: "key",
							});
							if (select)
								this.in.exec("select-row", { id: rowId });
						}
						break;
					}
					case "arrowdown": {
						const {
							flatData: data,
							focusCell,
							_select: select,
						} = this.getState();
						event.preventDefault();
						if (isInput) return;

						const colId = focusCell
							? focusCell.column
							: this._getFirstVisibleColumn()?.id;
						const rowId = focusCell
							? this.getNextRow(focusCell.row)?.id
							: data[0]?.id;
						if (colId && rowId) {
							this.in.exec("focus-cell", {
								row: rowId,
								column: colId,
								eventSource: "key",
							});
							if (select)
								this.in.exec("select-row", { id: rowId });
						}
						break;
					}
					case "arrowright": {
						const { focusCell } = this.getState();
						if (isInput) return;

						event.preventDefault();
						if (focusCell) {
							const colId = this.getNextColumn(
								focusCell.column,
								true
							)?.id;
							if (colId) {
								this.in.exec("focus-cell", {
									row: focusCell.row,
									column: colId,
									eventSource: "key",
								});
							}
						}
						break;
					}
					case "arrowleft": {
						const { focusCell } = this.getState();
						if (isInput) return;

						event.preventDefault();
						if (focusCell) {
							const colId = this.getPrevColumn(
								focusCell.column,
								true
							)?.id;
							if (colId) {
								this.in.exec("focus-cell", {
									row: focusCell.row,
									column: colId,
									eventSource: "key",
								});
							}
						}
						break;
					}
					case "tab": {
						const {
							editor,
							focusCell,
							_select: select,
						} = this.getState();
						if (editor) {
							event.preventDefault();

							const column = editor.column;
							let id = editor.id;
							let col = this.getNextEditor(
								this.getRow(id),
								this.getColumn(column)
							);
							if (!col) {
								const row = this.getNextRow(id);
								if (row) {
									id = row.id;
									col = this.getNextEditor(row);
								}
							}

							if (col) {
								this.in.exec("open-editor", {
									id,
									column: col.id,
								});
								this.in.exec("focus-cell", {
									row: id,
									column: col.id,
									eventSource: "key",
								});
								if (select && !this.isSelected(id))
									this.in.exec("select-row", { id });
							}
						} else if (focusCell) {
							this.in.exec("focus-cell", { eventSource: "key" });
						}
						break;
					}
					case "shift+tab": {
						const {
							editor,
							focusCell,
							_select: select,
						} = this.getState();
						if (editor) {
							event.preventDefault();

							const column = editor.column;
							let id = editor.id;
							let col = this.getPrevEditor(
								this.getRow(id),
								this.getColumn(column)
							);
							if (!col) {
								const row = this.getPrevRow(id);
								if (row) {
									id = row.id;
									col = this.getPrevEditor(row);
								}
							}

							if (col) {
								this.in.exec("open-editor", {
									id,
									column: col.id,
								});
								this.in.exec("focus-cell", {
									row: id,
									column: col.id,
									eventSource: "key",
								});
								if (select && !this.isSelected(id))
									this.in.exec("select-row", { id });
							}
						} else if (focusCell) {
							this.in.exec("focus-cell", { eventSource: "key" });
						}
						break;
					}
					case "escape": {
						const { editor } = this.getState();
						if (editor) {
							this.in.exec("close-editor", { ignore: true });
							this.in.exec("focus-cell", {
								row: editor.id,
								column: editor.column,
								eventSource: "key",
							});
						}
						break;
					}
					case "f2": {
						const { editor, focusCell } = this.getState();
						if (!editor && focusCell) {
							this.in.exec("open-editor", {
								id: focusCell.row,
								column: focusCell.column,
							});
						}
						break;
					}
					case "enter": {
						const { focusCell, tree } = this.getState();
						if (!isInput && tree && focusCell) {
							const column = this.getColumn(focusCell.column);
							if (column.treetoggle) {
								const row = this.getRow(focusCell.row);
								if (!row.data) return;
								this.in.exec(
									row.open ? "close-row" : "open-row",
									{
										id: focusCell.row,
										nested: true,
									}
								);
							}
						}
						break;
					}
					case "home": {
						const { editor, focusCell } = this.getState();
						if (!editor && focusCell) {
							event.preventDefault();
							const colId = this._getFirstVisibleColumn()?.id;
							this.in.exec("focus-cell", {
								row: focusCell.row,
								column: colId,
								eventSource: "key",
							});
						}
						break;
					}
					case "ctrl+home": {
						const {
							editor,
							focusCell,
							flatData: data,
							_select: select,
						} = this.getState();
						if (!editor && focusCell) {
							event.preventDefault();
							const rowId = data[0]?.id;
							const colId = this._getFirstVisibleColumn()?.id;
							if (rowId && colId) {
								this.in.exec("focus-cell", {
									row: rowId,
									column: colId,
									eventSource: "key",
								});
								if (select && !this.isSelected(rowId))
									this.in.exec("select-row", { id: rowId });
							}
						}
						break;
					}
					case "end": {
						const { editor, focusCell } = this.getState();
						if (!editor && focusCell) {
							event.preventDefault();
							const colId = this._getLastVisibleColumn()?.id;
							const rowId = focusCell.row;
							this.in.exec("focus-cell", {
								row: rowId,
								column: colId,
								eventSource: "key",
							});
						}
						break;
					}
					case "ctrl+end": {
						const {
							editor,
							focusCell,
							flatData: data,
							_select: select,
						} = this.getState();
						if (!editor && focusCell) {
							event.preventDefault();
							const rowId = data.at(-1).id;
							const colId = this._getLastVisibleColumn()?.id;
							if (rowId && colId) {
								this.in.exec("focus-cell", {
									row: rowId,
									column: colId,
									eventSource: "key",
								});
								if (select && !this.isSelected(rowId))
									this.in.exec("select-row", { id: rowId });
							}
						}
						break;
					}
					case "ctrl+z": {
						this.in.exec("undo", {});
						break;
					}
					case "ctrl+y": {
						this.in.exec("redo", {});
						break;
					}
				}
			}
		);

		inBus.on("scroll", (ev: IDataMethodsConfig["scroll"]) => {
			const {
				_columns,
				split,
				_sizes,
				flatData: data,
				dynamic,
			} = this.getState();

			let left = -1,
				top = -1,
				width = 0;
			if (ev.column) {
				left = 0;
				const ind = _columns.findIndex(a => a.id == ev.column);
				width = _columns[ind].width;
				for (let i = split.left ?? 0; i < ind; i++) {
					const col = _columns[i];
					if (col.hidden) continue;
					left += col.width;
				}
			}
			if (ev.row && !dynamic) {
				const index = data.findIndex(a => a.id === ev.row);
				if (index >= 0) top = _sizes.rowHeight * index;
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

		inBus.on("print", (ev: IDataMethodsConfig["print"]) => {
			const config = normalizePrintConfig(ev);
			this.setState({ _print: config });
			this.setStateAsync({ _print: null });
		});

		inBus.on("undo", () => {
			this._historyManager?.handleUndo();
		});

		inBus.on("redo", () => {
			this._historyManager?.handleRedo();
		});

		this.initOnce();
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

	initOnce() {
		const state: Partial<IDataConfig> = {
			sortMarks: {},
			_filterIds: null,
			data: [],
			filterValues: {},
			scroll: null,
			editor: null,
			focusCell: null,
			_print: null,
			history: { undo: 0, redo: 0 },
		};
		this._router.init(state);
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
		// perform these changes only if data was reset
		if (!isSame(this.getState().data, state.data)) {
			if (state.tree) {
				this._branches = { 0: { data: state.data } };
				state.data = this.normalizeTreeRows(state.data);
			} else state.data = this.normalizeRows(state.data);

			this.setState({
				_filterIds: null,
				filterValues: {},
				sortMarks: {},
			});
			if (this._historyManager) this._historyManager.resetHistory();
		}

		if (isCommunity()) {
			if (state.tree) state.undo = false;
			if (state.split?.right) state.split.right = 0;
		}

		if (state.undo && !this._historyManager) {
			this._historyManager = new HistoryManager(
				this.in,
				this.getState.bind(this),
				this.setState.bind(this)
			);
		}

		this._router.init({
			...state,
		});
	}

	setState(state: Partial<IData>, ctx?: TDataConfig) {
		return this._router.setState(state, ctx);
	}

	setStateAsync(state: Partial<IData>) {
		this._router.setStateAsync(state);
	}

	getRow(id: TID): IRow {
		const { tree } = this.getState();
		if (tree) return this._branches[id];
		return this.getState().data.find(a => a.id == id);
	}

	getRowIndex(id: TID, data?: any[]): number {
		if (!data) data = this.getState().flatData;
		return data.findIndex(a => a.id == id);
	}

	getNextRow(id: TID): IRow {
		const data = this.getState().flatData;
		const index = this.getRowIndex(id, data);
		return data[index + 1];
	}

	getPrevRow(id: TID): IRow {
		const data = this.getState().flatData;
		const index = this.getRowIndex(id, data);
		return data[index - 1];
	}

	getColumn(id: TID): IColumn {
		return this.getState().columns.find(a => a.id == id);
	}

	getNextColumn(id: TID, visible?: boolean): IRenderColumn {
		const columns = this.getState()._columns;
		const index = columns.findIndex((c: IRenderColumn) => c.id == id);

		if (visible) {
			return this._getFirstVisibleColumn(index + 1);
		}

		return columns[index + 1];
	}

	getPrevColumn(id: TID, visible?: boolean): IRenderColumn {
		const columns = this.getState()._columns;
		const index = columns.findIndex((c: IRenderColumn) => c.id == id);

		if (visible) {
			return this._getLastVisibleColumn(index - 1);
		}

		return columns[index - 1];
	}

	_getFirstVisibleColumn(index?: number): IRenderColumn {
		const columns = this.getState()._columns;
		let start = index ?? 0;

		while (
			start < columns.length &&
			(columns[start]?.hidden || columns[start]?.collapsed)
		) {
			start++;
		}

		return columns[start];
	}

	_getLastVisibleColumn(index?: number): IRenderColumn {
		const columns = this.getState()._columns;

		let start = index ?? columns.length - 1;

		while (
			start < columns.length &&
			(columns[start]?.hidden || columns[start]?.collapsed)
		) {
			start--;
		}

		return columns[start];
	}

	isCellEditable(row: IRow, column: IColumn) {
		const { editor, hidden } = column;
		if (!editor || hidden) return false;
		if (typeof editor === "function") return editor(row, column);
		return true;
	}

	getNextEditor(row: IRow, column?: IColumn): IColumn {
		let columns = this.getState().columns;
		if (column) {
			const index = columns.findIndex(c => c.id == column.id);
			columns = columns.slice(index + 1);
		}
		return columns.find(c => this.isCellEditable(row, c));
	}

	getPrevEditor(row: IRow, column?: IColumn): IColumn {
		let columns = this.getState().columns;
		if (column) {
			const index = columns.findLastIndex(c => c.id == column.id);
			columns = columns.slice(0, index);
		}
		return columns.findLast(c => this.isCellEditable(row, c));
	}

	toggleBranch(id: TID, open: boolean, nested?: boolean) {
		let item = this._branches[id];

		let { data } = this.getState();
		data = [...data];

		if (id !== 0) {
			item = { ...item, open };
			const update = this.updateTreeRow(item);
			if (item.$parent === 0) data = update;
		}

		if (nested && item.data?.length) {
			item.data.forEach((row: IRow) => {
				const update = this.toggleKids(row, open, nested);
				if (id === 0) data = update;
			});
		}
		this.setState({ data });
	}

	toggleKids(item: IRow, open: boolean, nested?: boolean) {
		item = { ...item, open };

		const data = this.updateTreeRow(item);

		if (nested && item.data?.length) {
			item.data.forEach((row: IRow) => {
				this.toggleKids(row, open, nested);
			});
		}
		return data;
	}

	private updateTreeRow(item: IRow) {
		const id = item.id;

		this._branches[id] = item;

		const parentRow = this._branches[item.$parent];
		const parentIndex = parentRow.data.findIndex((a: IRow) => a.id == id);

		parentRow.data = [...parentRow.data];
		parentRow.data[parentIndex] = item;

		return parentRow.data;
	}

	private isSelected(id: TID): boolean {
		return this.getState().selectedRows.indexOf(id) !== -1;
	}

	private findAndRemove(items: any[], id: TID): any {
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items.splice(i, 1)[0];
			}
			if (items[i].data) {
				const copy = [...items[i].data];
				const found = this.findAndRemove(copy, id);
				if (found) {
					items[i] = {
						...items[i],
						data: copy,
					};
					return found;
				}
			}
		}
		return null;
	}

	private insertItem(
		items: any[],
		targetId: TID,
		item: any,
		mode: IDataMethodsConfig["move-item"]["mode"]
	): boolean {
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == targetId) {
				const targetItem = items[i];
				const insertIndex = mode === "before" ? i : i + 1;

				// is a branch
				if (targetItem.data) {
					if (mode === "before") {
						const prevItem = i > 0 ? items[i - 1] : null;

						// open branch - insert as last child of prev. branch (before)
						if (prevItem?.data && prevItem.open) {
							items[i - 1] = {
								...prevItem,
								data: [...prevItem.data, item],
							};
						} else {
							items.splice(insertIndex, 0, item);
						}

						return true;
					} else {
						// open branch - insert as first child of target branch (after)
						if (targetItem.open) {
							items[i] = {
								...targetItem,
								data: [item, ...targetItem.data],
							};
							return true;
						}
					}
				}

				items.splice(insertIndex, 0, item);
				return true;
			}

			if (items[i].data) {
				items[i] = {
					...items[i],
					data: [...items[i].data],
				};
				if (this.insertItem(items[i].data, targetId, item, mode)) {
					return true;
				}
			}
		}
		return false;
	}

	private moveItem(
		id: TID,
		target: TID,
		data: any[],
		mode: IDataMethodsConfig["move-item"]["mode"]
	) {
		const items = [...data];
		const movedItem = this.findAndRemove(items, id);
		this.insertItem(items, target, movedItem, mode);
		return items;
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
		if (!col.width) col.width = col.flexgrow ? 17 : sizes.columnWidth;

		col._colindex = index + 1;

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
				(config as any).splice(i + r, 0, { _hidden: true });
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
							width += curCell.width || sizes.columnWidth;
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

			if (
				type === "header" &&
				row.filter &&
				typeof row.filter === "string"
			) {
				row.filter = { type: row.filter };
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

			if (row.data) {
				if (row.data.length) {
					row.$count = row.data.length;
					this.normalizeTreeRows(row.data, row.$level + 1, row.id);
				} else {
					delete row.data;
					delete row.$count;
					delete row.open;
				}
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

	filterTree(
		data: IRow[],
		filter: (row: IRow) => boolean,
		filterIds: TID[]
	): TID[] {
		data.forEach(row => {
			if (filter(row)) filterIds.push(row.id);
			if (row.data) this.filterTree(row.data, filter, filterIds);
		});
		return filterIds;
	}

	flattenRows(data: IRow[], flatData: IRow[], filterIds: TID[]): IRow[] {
		const res: IRow[] = flatData;
		data.forEach(row => {
			if (!filterIds || filterIds.includes(row.id)) res.push(row);
			if (row.data?.length && row.open !== false) {
				this.flattenRows(row.data, res, filterIds);
			}
		});
		return res;
	}

	createFilter(filterValues: IFilterValues) {
		const { _columns: columns } = this.getState();
		const filters: ((obj: any) => boolean)[] = [];

		for (const field in filterValues) {
			const { config, type } = columns
				.find(c => c.id == field)
				.header.find(h => h.filter).filter;
			const value = filterValues[field];

			filters.push((obj: any) => {
				if (config?.handler) {
					return config.handler(obj[field], value);
				}

				return getFilterHandler(type)(obj[field], value);
			});
		}

		return (obj: any) => {
			for (let i = 0; i < filters.length; i++) {
				if (!filters[i](obj)) {
					return false;
				}
			}
			return true;
		};
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

interface ISkipUndoAction {
	skipUndo?: boolean;
}
export interface IDataMethodsConfig {
	["update-cell"]: {
		id: TID;
		column: TID;
		value: string | number | Date;
		eventSource?: string;
	};
	["add-row"]: {
		id?: TID;
		before?: TID;
		after?: TID;
		row: IRow;
		select?: boolean;
		eventSource?: string;
	};
	["delete-row"]: { id: TID; eventSource?: string };
	["update-row"]: {
		id: TID;
		row: Record<string, any>;
		eventSource?: string;
	};
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
		inProgress?: boolean;
		eventSource?: string;
	};
	["hide-column"]: {
		id: string;
		mode: boolean;
		eventSource?: string;
	} & ISkipUndoAction;
	["sort-rows"]: {
		key: string;
		order?: "asc" | "desc";
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
		filter?: any;
		key?: string;
		value?: any;
	};
	["collapse-column"]: {
		id: TID;
		row: number;
		mode?: boolean;
		eventSource?: string;
	};
	["move-item"]: {
		id: TID;
		target: TID;
		mode: "before" | "after";
		inProgress?: boolean;
		eventSource?: string;
	};
	["open-row"]: {
		id: TID;
		nested?: boolean;
		eventSource?: string;
	};
	["close-row"]: {
		id: TID;
		nested?: boolean;
		eventSource?: string;
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
	["focus-cell"]: {
		row?: TID;
		column?: TID;
		eventSource: string;
	};
	["print"]?: IPrintConfig;
	["undo"]: void;
	["redo"]: void;
}
