import type { TSortObject, TSortValue, TSortConfig } from "./types";

function sortAsc(a: TSortValue, b: TSortValue): number {
	if (typeof a === "undefined" || a === null) return -1;
	if (typeof b === "undefined" || b === null) return 1;
	return a === b ? 0 : a > b ? 1 : -1;
}

function sortDesc(a: TSortValue, b: TSortValue): number {
	return -sortAsc(a, b);
}

function sortBy(key: string, order: string) {
	const sortMethod = order === "asc" ? sortAsc : sortDesc;
	return function (a: TSortObject, b: TSortObject) {
		return sortMethod(a[key], b[key]);
	};
}

export function sortByMany(sortArray: TSortConfig[]) {
	if (!sortArray || !sortArray.length) return;

	const sorts = sortArray.map(item => sortBy(item.key, item.order));
	if (sortArray.length === 1) return sorts[0];

	return function (a: TSortObject, b: TSortObject) {
		for (let i = 0; i < sorts.length; i++) {
			const res = sorts[i](a, b);
			if (res !== 0) return res;
		}
		return 0;
	};
}
