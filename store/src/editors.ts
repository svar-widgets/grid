import type { IColumn, IRow, Value, ValueGetter, ValueSetter } from "./types";

import { uid } from "wx-lib-state";

function rawGetter(key: string): ValueGetter {
	return obj => obj[key];
}
function rawSetter(key: string): ValueSetter {
	return (obj, v) => (obj[key] = v);
}

export function getValue(row: IRow, col: IColumn): any {
	return (col.getter || rawGetter(col.id))(row) ?? "";
}

export function setValue(row: IRow, col: IColumn, v: Value): any {
	return (col.setter || rawSetter(col.id))(row, v);
}

export function editorConfig(columns: IColumn[]) {
	return columns
		.filter(a => !!a.editor)
		.map(col => {
			const obj: any = {
				key: col.id || uid(),
				type:
					typeof col.editor === "object"
						? col.editor.type
						: col.editor,
				label: col.header,
			};
			if (col.options) obj.options = col.options;
			return obj;
		});
}
