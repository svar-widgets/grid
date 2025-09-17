import type {
	IColumn,
	IExportCell,
	IExportMerged,
	IExportOptions,
	IExportColSize,
	IExportRowSize,
	IData,
	TExportStyles,
	TSkinName,
	IDataHash,
	Value,
} from "../types";
import { getRenderValue } from "./index";
import { getValue } from "../editors";
import { isSame } from "@svar-ui/lib-state";

export function getExcelData(
	state: Partial<IData>,
	options: IExportOptions,
	styles: IDataHash<any>[]
) {
	const cells: IExportCell[][] = [];
	const merged: IExportMerged[] = [];
	const colSizes: IExportColSize[] = [];
	let rowSizes: IExportRowSize[] = [];
	const cols = state._columns;
	const data = state.flatData;
	const sizes = state._sizes;

	for (const c of cols)
		colSizes.push({
			width: c.flexgrow ? sizes.columnWidth : c.width,
		});

	let rIndex = 0;

	if (options.header !== false && cols[0].header) {
		addExcelHeader("header", cols, cells, merged, rIndex, options, styles);

		rowSizes = rowSizes.concat(
			sizes.headerRowHeights.map(height => ({ height }))
		);
		rIndex += (<any>cols[0].header).length;
	}

	for (let r = 0; r < data.length; r++) {
		const dataRow: IExportCell[] = [];
		for (let c = 0; c < cols.length; c++) {
			const row = data[r];
			const col = cols[c];
			const value = getValue(row, col) ?? "";
			let text = getRenderValue(row, col);
			let newStyle;
			if (options.cellStyle)
				newStyle = options.cellStyle(value, row, col);

			if (options.cellTemplate) {
				text = options.cellTemplate(value, row, col) ?? text;
			}

			const result = prepareCellValues(text, 2, newStyle, styles);

			dataRow.push(result);
		}

		cells.push(dataRow);
		rowSizes.push({ height: sizes.rowHeight });
	}
	rIndex += data.length;

	if (options.footer !== false && cols[0].footer) {
		addExcelHeader("footer", cols, cells, merged, rIndex, options, styles);
		rowSizes = rowSizes.concat(
			sizes.footerRowHeights.map(height => ({ height }))
		);
	}
	return { cells, merged, rowSizes, colSizes, styles };
}

function addExcelHeader(
	type: "header" | "footer",
	cols: IColumn[],
	cells: IExportCell[][],
	merged: IExportMerged[],
	rIndex: number,
	options: IExportOptions,
	styles: IDataHash<any>[]
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

			let v = header.text ?? "";
			let newStyle;

			if (options.headerCellStyle)
				newStyle = options.headerCellStyle(v, header, cols[c], type);

			if (options.headerCellTemplate)
				v = options.headerCellTemplate(v, header, cols[c], type) ?? v;

			let s;
			if (type == "header") {
				if (r == cols[0][type as keyof IColumn].length - 1) s = 1;
				else s = 0;
			} else if (r) s = 4;
			else s = 3;

			const result = prepareCellValues(v, s, newStyle, styles);
			row.push(result);
		}
		cells.push(row);
	}
}

function prepareCellValues(
	v: Value,
	baseIndex: number,
	newStyle: IDataHash<any>,
	styles: IDataHash<any>[]
) {
	let s = baseIndex;
	if (v && v instanceof Date) {
		v = getExcelDate(v);
		newStyle = newStyle || {};
		newStyle.format = newStyle.format || "dd/mm/yyyy";
	}
	if (newStyle) {
		newStyle = { ...styles[baseIndex], ...newStyle };
		const i = styles.findIndex(style => isSame(style, newStyle));
		if (i < 0) {
			styles.push(newStyle);
			s = styles.length - 1;
		} else s = i;
	}
	return { v: v + "", s };
}

export function getExportStyles(skin: TSkinName): TExportStyles {
	const fontColor = {
		material: "#000000",
		willow: "#000000",
		"willow-dark": "#ffffff",
	};

	const bg = {
		material: "none",
		willow: "none",
		"willow-dark": "#2a2b2d",
	};
	const headerBg = {
		material: "#fafafb",
		willow: "#f2f3f7",
		"willow-dark": "#20262b",
	};

	const border = {
		material: "0.5px solid #dfdfdf",
		willow: "0.5px solid #e6e6e6",
		"willow-dark": "0.5px solid #384047",
	};

	const headerBorderColor = {
		material: "#dfdfdf",
		willow: "#e6e6e6",
		"willow-dark": "#384047",
	};

	const color = fontColor[skin];
	const hBorder = "0.5px solid " + headerBorderColor[skin];
	const align = {
		verticalAlign: "center",
		align: "left",
	};
	const headerStyles = {
		fontWeight: "bold",
		color,
		background: headerBg[skin],
		...align,
		borderBottom: hBorder,
		borderRight: hBorder,
	};

	const styles = {
		cell: {
			color,
			background: bg[skin],
			borderBottom: border[skin],
			borderRight: border[skin],
			...align,
		},
		header: { ...headerStyles },
		footer: { ...headerStyles },
	};
	return styles;
}

function getExcelDate(date: Date): number {
	if (!date) return null;
	const returnDateTime =
		25569 +
		(date.getTime() - date.getTimezoneOffset() * 60000) / (86400 * 1000);
	return returnDateTime;
}
