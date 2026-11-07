import type { IColumn, IExportCell, ICSVOptions, IData } from "../types";
import { getRenderValue } from "./index";

export function getCsvData(state: Partial<IData>, options: ICSVOptions) {
	const reg = /\n|"|;|,/;
	let csv = "";

	const rowSep = options.rows || "\n";
	const colSep = options.cols || "\t";

	const cols = state._columns;
	const data = state.flatData;

	if (options.header !== false && cols[0].header)
		csv = addCsvHeader("header", cols, csv, colSep, rowSep);

	for (let r = 0; r < data.length; r++) {
		const row: IExportCell[] = [];
		for (let c = 0; c < cols.length; c++) {
			let value = getRenderValue(data[r], cols[c]);

			if (reg.test(value)) value = '"' + value.replace(/"/g, '""') + '"';

			row.push(value);
		}
		csv += (csv ? rowSep : "") + row.join(colSep);
	}

	if (options.footer !== false && cols[0].footer)
		csv = addCsvHeader("footer", cols, csv, colSep, rowSep);

	return csv;
}

function addCsvHeader(
	type: "header" | "footer",
	cols: IColumn[],
	csv: string,
	colSep: string,
	rowSep: string
) {
	const reg = /\n|"|;|,/;
	for (let r = 0; r < cols[0][type as keyof IColumn].length; r++) {
		const row: IExportCell[] = [];
		for (let c = 0; c < cols.length; c++) {
			const header = cols[c][type as keyof IColumn][r];
			let value = (header.text || "") + "";
			if (reg.test(value)) value = '"' + value.replace(/"/g, '""') + '"';
			row.push(value);
		}
		csv += (csv ? rowSep : "") + row.join(colSep);
	}
	return csv;
}
