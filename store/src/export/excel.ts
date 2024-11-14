import type {
	IColumn,
	IExportCell,
	IExportMerged,
	IExportOptions,
	IExportColSize,
	IExportRowSize,
	IData,
	TExportStyles,
} from "../types";
import { getRenderValue } from "./index";

export function getExcelData(state: Partial<IData>, options: IExportOptions) {
	const cells: IExportCell[][] = [];
	const merged: IExportMerged[] = [];
	const colSizes: IExportColSize[] = [];
	let rowSizes: IExportRowSize[] = [];

	const cols = state._columns;
	const data = state.flatData;
	const sizes = state._sizes;

	for (const c of cols)
		colSizes.push({
			width: c.flexgrow ? sizes.colWidth : c.width,
		});

	let rIndex = 0;

	if (options.header !== false && cols[0].header) {
		addExcelHeader("header", cols, cells, merged, rIndex);
		rowSizes = rowSizes.concat(
			sizes.headerRowHeights.map(height => ({ height }))
		);
		rIndex += (<any>cols[0].header).length;
	}

	for (let r = 0; r < data.length; r++) {
		const row: IExportCell[] = [];
		for (let c = 0; c < cols.length; c++)
			row.push({ v: getRenderValue(data[r], cols[c]), s: 2 });
		cells.push(row);
		rowSizes.push({ height: sizes.rowHeight });
	}
	rIndex += data.length;

	if (options.footer !== false && cols[0].footer) {
		addExcelHeader("footer", cols, cells, merged, rIndex);
		rowSizes = rowSizes.concat(
			sizes.footerRowHeights.map(height => ({ height }))
		);
	}

	return { cells, merged, rowSizes, colSizes };
}

function addExcelHeader(
	type: "header" | "footer",
	cols: IColumn[],
	cells: IExportCell[][],
	merged: IExportMerged[],
	rIndex: number
) {
	for (let r = 0; r < cols[0][type as keyof IColumn].length; r++) {
		const row: IExportCell[] = [];
		for (let c = 0; c < cols.length; c++) {
			const header = cols[c][type as keyof IColumn][r];
			const colspan = header.colspan ? header.colspan - 1 : 0;
			const rowspan = header.rowspan ? header.rowspan - 1 : 0;
			if (colspan || rowspan) {
				merged.push({
					from: { row: r + rIndex, column: c },
					to: { row: r + rIndex + rowspan, column: c + colspan },
				});
			}

			const value = (header.text || "") + "";

			let style;

			if (type == "header") {
				if (r == cols[0][type as keyof IColumn].length - 1) style = 1;
				else style = 0;
			} else if (r) style = 4;
			else style = 3;

			row.push({ v: value, s: style });
		}
		cells.push(row);
	}
}

export function getExportStyles(): TExportStyles {
	const headerStyles = {
		fontWeight: "bold",
		color: "#000000b3",
		background: "#f4f5f9",
		verticalAlign: "center",
		align: "left",
	};

	const styles = {
		cell: {
			color: "#000000b3",
			verticalAlign: "center",
			align: "left",
		},
		header: { ...headerStyles },
		footer: { ...headerStyles },
		lastHeaderCell: {
			...headerStyles,
			borderBottom: "0.5px solid #3498ff",
		},
		firstFooterCell: { ...headerStyles, borderTop: "0.5px solid #3498ff" },
	};
	return styles;
}
