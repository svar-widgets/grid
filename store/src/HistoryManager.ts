import { deepCopy, EventBus, TID, isSame } from "@svar-ui/lib-state";
import type { IDataMethodsConfig } from "./DataStore";
import { getValue } from "./editors";
import { IColumn, IData, IRow, TMethodsConfig } from "./types";

type ActionType = keyof IDataMethodsConfig;
interface ActionData<T extends ActionType> {
	action: T;
	data: IDataMethodsConfig[T];
}

interface HistoryEntry extends ActionData<ActionType> {
	source: ActionData<ActionType>;
}

const COLUMNS_ACTIONS = ["resize-column", "hide-column", "update-cell"];
const DATA_ACTIONS = ["delete-row", "update-row", "update-cell"];
const FLATDATA_ACTIONS = ["move-item"];
const PROGRESS_ACTIONS = ["resize-column", "move-item"];

export class HistoryManager {
	private undo: HistoryEntry[] = [];
	private redo: HistoryEntry[] = [];
	private progress: Partial<Record<ActionType, boolean>> = {};
	private in: EventBus<TMethodsConfig, keyof TMethodsConfig>;
	private getState: () => Partial<IData>;
	private setState: (state: Partial<IData>) => void;
	private _previousValues: Partial<IData> = {};

	constructor(
		eventBus: EventBus<TMethodsConfig, keyof TMethodsConfig>,
		stateGetter: () => Partial<IData>,
		stateSetter: (state: Partial<IData>) => void
	) {
		this.in = eventBus;
		this.getState = stateGetter;
		this.setState = stateSetter;
		this.setHandlers();

		this.resetStateHistory();
	}

	getHandlers(): { [key: string]: { handler: (ev: any) => HistoryEntry } } {
		return {
			"add-row": {
				handler: (ev: IDataMethodsConfig["add-row"]) => {
					return {
						action: "delete-row",
						data: { id: ev.id },
						source: { action: "add-row", data: ev },
					};
				},
			},
			"delete-row": {
				handler: (ev: IDataMethodsConfig["delete-row"]) => {
					const { id } = ev;

					const { data } = this.getPrev();
					const rowIndex = data.findIndex(a => a.id == id);

					return {
						action: "add-row",
						data: {
							id,
							row: data[rowIndex],
							before:
								rowIndex < data.length - 1
									? data[rowIndex + 1].id
									: undefined,
						},
						source: { action: "delete-row", data: ev },
					};
				},
			},
			"update-cell": {
				handler: (ev: IDataMethodsConfig["update-cell"]) => {
					const { id, column } = ev;

					const row = this.getRow(id);
					const col = this.getColumn(column);

					const prevValue = getValue(row, col);
					// isSame is for dates
					return !isSame(prevValue, ev.value)
						? {
								action: "update-cell",
								data: { id, column, value: prevValue },
								source: { action: "update-cell", data: ev },
							}
						: null;
				},
			},
			"update-row": {
				handler: (ev: IDataMethodsConfig["update-row"]) => {
					const { id } = ev;

					const rowData = this.getRow(id);

					return {
						action: "update-row",
						data: { id, row: rowData },
						source: { action: "update-row", data: ev },
					};
				},
			},
			"resize-column": {
				handler: (ev: IDataMethodsConfig["resize-column"]) => {
					const { id, width } = ev;
					const column = this.getColumn(id);
					const { _sizes: sizes } = this.getState();

					return {
						action: "resize-column",
						data: { id, width: column.width ?? sizes.columnWidth },
						source: {
							action: "resize-column",
							data: { id, width },
						},
					};
				},
			},
			"hide-column": {
				handler: (ev: IDataMethodsConfig["hide-column"]) => {
					const { id } = ev;
					const column = this.getColumn(id);

					return {
						action: "hide-column",
						data: { id, mode: column.hidden },
						source: {
							action: "hide-column",
							data: ev,
						},
					};
				},
			},
			"collapse-column": {
				handler: (ev: IDataMethodsConfig["collapse-column"]) => {
					const { id, row, mode } = ev;

					return {
						action: "collapse-column",
						data: {
							id,
							row,
							mode: typeof mode === "boolean" ? !mode : mode,
						},
						source: { action: "collapse-column", data: ev },
					};
				},
			},
			"move-item": {
				handler: (ev: IDataMethodsConfig["move-item"]) => {
					const { id, target, mode } = ev;
					const { flatData } = this.getPrev();

					const sourceIndex = flatData.findIndex(a => a.id == id);

					return {
						action: "move-item",
						data: {
							id,
							target: flatData[
								sourceIndex + (sourceIndex ? -1 : 1)
							].id,
							mode: sourceIndex ? "after" : "before",
						},
						source: {
							action: "move-item",
							data: { id, target, mode },
						},
					};
				},
			},
			"open-row": {
				handler: (ev: IDataMethodsConfig["open-row"]) => {
					const { id, nested } = ev;
					return {
						action: "close-row",
						data: { id, nested },
						source: { action: "open-row", data: ev },
					};
				},
			},
			"close-row": {
				handler: (ev: IDataMethodsConfig["close-row"]) => {
					const { id, nested } = ev;

					return {
						action: "open-row",
						data: { id, nested },
						source: { action: "close-row", data: ev },
					};
				},
			},
		};
	}

	resetHistory() {
		this.undo = [];
		this.redo = [];
		this.progress = {};

		this.resetStateHistory();
	}

	private getPrev() {
		return this._previousValues;
	}

	private setHandlers() {
		const handlers = this.getHandlers();

		for (const action in handlers) {
			this.in.intercept(action as ActionType, (ev: any) => {
				if (
					ev.eventSource === "undo" ||
					ev.eventSource === "redo" ||
					ev.skipUndo
				)
					return;

				if (PROGRESS_ACTIONS.includes(action)) {
					if (
						(ev.inProgress &&
							!this.progress[action as ActionType]) ||
						typeof ev.inProgress !== "boolean"
					) {
						if (FLATDATA_ACTIONS.includes(action))
							this.setPrev("flatData");
						if (COLUMNS_ACTIONS.includes(action))
							this.setPrev("columns");
					}
					this.progress[action as ActionType] = ev.inProgress;
					return;
				}

				if (DATA_ACTIONS.includes(action)) this.setPrev("data");
				if (COLUMNS_ACTIONS.includes(action)) this.setPrev("columns");
			});

			this.in.on(action as ActionType, (ev: any) => {
				if (
					ev.eventSource === "undo" ||
					ev.eventSource === "redo" ||
					ev.skipUndo ||
					ev.inProgress
				)
					return;

				const historyEntry = handlers[action].handler(ev);
				if (historyEntry) this.addToHistory(historyEntry);
			});
		}
	}

	private setPrev(prop: keyof IData) {
		(this._previousValues as any)[prop] = deepCopy(this.getState()[prop]);
	}

	private addToHistory(entry: HistoryEntry) {
		this.undo.push(entry);
		this.redo = [];

		this.setStateHistory();
	}

	handleUndo() {
		if (!this.undo.length) return;

		const action = this.undo.pop();
		this.redo.push({ ...action.source, source: action });

		this.in.exec(action.action, {
			...action.data,
			eventSource: "undo",
		} as any);

		this.setStateHistory();
	}

	handleRedo() {
		if (!this.redo.length) return;

		const action = this.redo.pop();
		this.undo.push({ ...action.source, source: action });

		this.in.exec(action.action, {
			...action.data,
			eventSource: "redo",
		} as any);

		this.setStateHistory();
	}

	private resetStateHistory() {
		this.setState({ history: { undo: 0, redo: 0 } });
	}

	private setStateHistory() {
		this.setState({
			history: {
				undo: this.undo.length,
				redo: this.redo.length,
			},
		});
	}

	private getRow(id: TID): IRow {
		const { data } = this.getPrev();

		if (this.getState().tree) return this.getTreeRow(data, id);

		return data.find(a => a.id == id);
	}

	private getTreeRow(data: IRow[], id: TID): IRow {
		for (let i = 0; i < data.length; i++) {
			if (data[i].id == id) return data[i];
			if (data[i].data) {
				const res = this.getTreeRow(data[i].data, id);
				if (res) return res;
			}
		}
		return null;
	}

	private getColumn(id: TID): IColumn {
		const { columns } = this.getPrev();
		return columns.find(a => a.id == id);
	}
}
