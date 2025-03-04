import { TFilterHandler, TFilterType } from "./types";

export const filtersHandlers: { [key: string]: TFilterHandler } = {
	text: (a: string, b: string) => {
		if (a) return a.toLowerCase().indexOf(b.toLowerCase()) !== -1;
		return !b;
	},
	richselect: (a: string | number, b: string | number) => {
		if (typeof b !== "number" && !b) return true;
		return a == b;
	},
};

export function getFilterHandler(type: TFilterType): TFilterHandler {
	return filtersHandlers[type];
}
