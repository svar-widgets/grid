import {
	TFilterHandler,
	TFilterType,
	IFilterValues,
	IFilterColumn,
} from "./types";

import { getValue } from "./editors";

export const filtersHandlers: { [key: string]: TFilterHandler } = {
	text: (a: string, b: string) => {
		if (a)
			return a.toString().toLowerCase().indexOf(b.toLowerCase()) !== -1;
		return !b;
	},
	richselect: (a: string | number, b: string | number) => {
		if (typeof b !== "number" && !b) return true;
		return a == b;
	},
	datepicker: (a: Date, b: Date) => {
		if (!b) return true;
		return a && isSameDate(a, b);
	},
};

export function getFilterHandler(type: TFilterType): TFilterHandler {
	return filtersHandlers[type];
}

export function createFilter(
	filterValues: IFilterValues,
	columns: IFilterColumn[]
) {
	const filters: ((obj: any) => boolean)[] = [];

	for (const field in filterValues) {
		const column = columns.find(c => c.id == field); // the non-strict comparison, since field is always a string
		const { config, type } = column.header.find(h => h.filter).filter;
		const value = filterValues[field];

		filters.push((obj: any) => {
			const oValue = getValue(obj, column);
			if (config?.handler) {
				return config.handler(oValue, value);
			}

			return getFilterHandler(type)(oValue, value);
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

function isSameDate(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}
