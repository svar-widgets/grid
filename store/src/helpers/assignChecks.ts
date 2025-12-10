import type { TID } from "@svar-ui/lib-state";
import type { IApi, IHistory } from "../types";

export interface ICheckableItem {
	id?: TID;
	isDisabled?:
		| ((ids: TID[], data: any[]) => boolean)
		| ((history: IHistory) => boolean)
		| ((api: IApi & { _temp: { id: TID; cut: boolean }[] }) => boolean);
	[key: string]: any;
}

export function assignChecks<T extends ICheckableItem>(items: T[]): T[] {
	return items.map(item => {
		item = { ...item };

		// handle nested items
		if (item.data)
			(item.data as ICheckableItem[]) = assignChecks(item.data);
		if (item.items)
			(item.data as ICheckableItem[]) = assignChecks(item.items);

		switch (item.id) {
			case "move-item:up":
				item.isDisabled = (ids, data) => isFirstRow(ids, data);
				break;
			case "move-item:down":
				item.isDisabled = (ids, data) => isLastRow(ids, data);
				break;
			case "undo":
				item.isDisabled = (history: IHistory) => !history.undo;
				break;
			case "redo":
				item.isDisabled = (history: IHistory) => !history.redo;
				break;
			case "paste-row":
				item.isDisabled = (api: any) => !api._temp?.length;
				break;
		}

		return item;
	});
}

function isFirstRow(ids: TID[], data: any[]) {
	return ids.some(id => data[0]?.id == id);
}

function isLastRow(ids: TID[], data: any[]) {
	return ids.some(id => data[data.length - 1]?.id == id);
}
