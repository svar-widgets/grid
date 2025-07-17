import type { IColumn, IRow, Value, ValueGetter, ValueSetter } from "./types";

import { uid } from "wx-lib-state";

function rawGetter(key: string): ValueGetter {
	return obj => obj[key];
}
function rawSetter(key: string): ValueSetter {
	return (obj, v) => (obj[key] = v);
}

export function getValue(row: IRow, col: IColumn): any {
	return (col.getter || rawGetter(col.id))(row);
}

export function setValue(row: IRow, col: IColumn, v: Value): any {
	return (col.setter || rawSetter(col.id))(row, v);
}

export function getEditorConfig(columns: IColumn[]) {
	return columns
		.filter(a => !!a.editor)
		.map(col => {
			let obj: any = {
				key: col.id || uid(),
				label: col.header,
			};
			if (col.options) obj.options = col.options;
			let editor = col.editor;
			if (typeof editor === "function") editor = editor();
			if (typeof editor === "object") {
				obj = { ...obj, ...editor };
				obj.comp = editor.type;
			} else obj.comp = editor;

			return obj;
		});
}
