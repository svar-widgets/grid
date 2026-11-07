import type { IColumn, IRow, Value, ValueGetter, ValueSetter } from "./types";

import { uid } from "@svar-ui/lib-state";
import type { TID } from "@svar-ui/lib-state";

function rawGetter(key: TID): ValueGetter {
	return obj => obj[key];
}
function rawSetter<T = Value>(key: TID): ValueSetter<T> {
	return (obj, v) => (obj[key] = v);
}

export function getValue(row: IRow, col: IColumn): any {
	return (col.getter || rawGetter(col.id))(row);
}

export function setValue<T = Value>(row: IRow, col: IColumn, v: T): any {
	const setter = (col.setter as ValueSetter<T>) || rawSetter<T>(col.id);
	return setter(row, v);
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
