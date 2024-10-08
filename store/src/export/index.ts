import type { IColumn, IRow } from "../types";
import { getValue } from "../editors";
export function download(blob: any, filename: string) {
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

export function getRenderValue(row: IRow, col: IColumn): string {
	let v = getValue(row, col);
	if (col.template) v = col.template(v, row, col);
	if (col.optionsMap) {
		if (Array.isArray(v)) v = v.map(x => col.optionsMap.get(x));
		else v = col.optionsMap.get(v);
	}
	return typeof v === "undefined" ? "" : v + "";
}
