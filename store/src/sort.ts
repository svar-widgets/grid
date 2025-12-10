import { getValue } from "./editors";
import type {
	TSortObject,
	TSortValue,
	TSortConfig,
	IColumn,
	TSortFunction,
} from "./types";

function sortAsc(a: TSortValue, b: TSortValue): number {
	if (typeof a === "undefined" || a === null) return -1;
	if (typeof b === "undefined" || b === null) return 1;
	return a === b ? 0 : a > b ? 1 : -1;
}

function sortDesc(a: TSortValue, b: TSortValue): number {
	return -sortAsc(a, b);
}

function sortBy(order: string, column: IColumn) {
	if (typeof column.sort === "function") {
		return function (a: TSortObject, b: TSortObject) {
			const comparisonResult = (column.sort as TSortFunction)(a, b);
			return order === "asc" ? comparisonResult : -comparisonResult;
		};
	}
	const sortMethod = order === "asc" ? sortAsc : sortDesc;
	return function (a: TSortObject, b: TSortObject) {
		return sortMethod(getValue(a, column), getValue(b, column));
	};
}

export function sortByMany(sortArray: TSortConfig[], columns: IColumn[]) {
	if (!sortArray || !sortArray.length) return;

	const sorts = sortArray.map(item => {
		const column = columns.find(c => c.id == item.key);
		return sortBy(item.order, column);
	});
	if (sortArray.length === 1) return sorts[0];

	return function (a: TSortObject, b: TSortObject) {
		for (let i = 0; i < sorts.length; i++) {
			const res = sorts[i](a, b);
			if (res !== 0) return res;
		}
		return 0;
	};
}
