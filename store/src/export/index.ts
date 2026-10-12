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
	let v = getValue(row, col) ?? "";
	if (col.template) {
		v = col.template(v, row, col);
	} else if (col.optionsMap) {
		if (Array.isArray(v)) v = v.map(x => col.optionsMap.get(x)).join(", ");
		else v = col.optionsMap.get(v);
	}

	return renderText(v);
}

// An object is blank only when v + "" would be "[object …]" or would throw.
function renderText(v: unknown): string {
	if (typeof v === "undefined") return "";
	if (v === null || typeof v !== "object") return (v as any) + "";

	try {
		const toString = (v as { toString?: unknown }).toString;
		if (
			typeof toString !== "function" ||
			toString === Object.prototype.toString
		)
			return "";
		return (v as any) + "";
	} catch {
		return "";
	}
}
