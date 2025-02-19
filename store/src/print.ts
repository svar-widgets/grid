import type {
	IFilterValues,
	IPrintConfig,
	IRenderColumn,
	IRenderHeaderConfig,
	TColumnType,
} from "./types";

// default config and sizes
const MODE = "portrait";
const PPI = 100;
const PAPER = "a4";
const PAPERS = {
	a3: { width: 11.7, height: 16.5 },
	a4: { width: 8.27, height: 11.7 },
	letter: { width: 8.5, height: 11 },
};

export function getPrintColumns(
	columns: IRenderColumn[],
	config: IPrintConfig
) {
	const tables: IRenderColumn[][] = [];

	let cols: IRenderColumn[] = [];
	let width: number = 0;

	const visibleColumns = columns.filter(col => !col.hidden);

	const maxWidth = getPaperWidth(config);

	visibleColumns.forEach((v, index) => {
		if (width + v.width <= maxWidth) {
			width += v.width;
			cols.push(v);
		} else {
			if (cols.length) tables.push(cols);

			cols = [v];
			width = v.width;
		}

		if (index === visibleColumns.length - 1 && cols.length) {
			tables.push(cols);
		}
	});

	return tables;
}

export function getHeaderFooterPrintColumns(
	columns: IRenderColumn[],
	type: TColumnType,
	rowsHeights: number[]
): IRenderHeaderConfig[][] {
	const result: IRenderHeaderConfig[][] = [];

	columns.forEach((col, c) => {
		const header = col[type];

		for (let r = 0; r < rowsHeights.length; r++) {
			if (!result[r]) result[r] = [];
			const hcell = { ...header[r] };

			if (result[r][c] !== null) {
				// for the case when the сolspan was divided into parts in order to fit on the sheet, need to create new cell
				if (!c && !hcell.rowspan && !hcell.colspan) {
					let colspan = 1;
					let nextCell = columns[c + colspan][type][r];
					let width = hcell.width;
					while (!nextCell.rowspan && !nextCell.colspan) {
						colspan++;
						nextCell = columns[c + colspan][type][r];
						width += nextCell.width;
					}
					hcell.colspan = colspan;
					hcell.width = width;
					hcell.height = rowsHeights[r];
				}
				result[r].push(hcell);

				if (!hcell.collapsed && hcell.colspan > 1) {
					let colstubs = hcell.colspan - 1;
					// for the case when the сolspan goes beyond the sheet width
					if (hcell.colspan + c > columns.length) {
						const colspan =
							hcell.colspan -
							(hcell.colspan + c - columns.length);

						hcell.colspan = colspan;
						hcell.width = columns
							.slice(c, c + colstubs + 1)
							.reduce((a, b) => a + b.width, 0);

						if (colspan > 1) colstubs = colspan - 1;
					}
					for (let y = 0; y < colstubs; y++) result[r].push(null);
				}
				if (hcell.rowspan > 1) {
					const rowstubs = hcell.rowspan;
					for (let y = 1; y < rowstubs; y++) {
						if (!result[r + y]) result[r + y] = [];
						result[r + y].push(null);
					}
				}
			}
		}

		if (col.collapsed) {
			for (let i = 0; i < result.length; i++) {
				const rRow = result[i];
				const currentCell = rRow[c];

				if (currentCell && currentCell.collapsed) {
					rRow[c] = null;
					if (!i) break;
				} else {
					const lastCell =
						currentCell ||
						rRow.findLast(cell => cell?.colspan >= 1);
					if (lastCell) {
						lastCell.colspan = lastCell.colspan - 1;
						lastCell.width = lastCell.width - col.width;
					}
				}
			}
		}
	});

	return result.map(row => row.filter(c => c && c.colspan !== 0));
}

function getPaperWidth(config: IPrintConfig) {
	const { mode, ppi, paper } = config;
	const { width, height } = PAPERS[paper];

	return getPixels(mode === "portrait" ? width : height, ppi);
}

function getPixels(inches: number, ppi: number) {
	return inches * ppi;
}

export function normalizePrintConfig(config: IPrintConfig = {}) {
	const { mode, ppi, paper } = config;

	return {
		mode: mode || MODE,
		ppi: ppi || PPI,
		paper: paper || PAPER,
	};
}

export function getPrintCellStyle(
	cell: IRenderHeaderConfig,
	columnWidth: number
) {
	if (cell.flexgrow) return `min-width:${columnWidth}px;width:auto`;
	return `width:${cell.width}px; max-width:${cell.width}px; height:${cell.height}px`;
}

export function getPrintFilterValue(
	filterValues: IFilterValues,
	columns: IRenderColumn[],
	cell: IRenderHeaderConfig
) {
	let value = filterValues[cell.id];
	if (cell.filter.type === "richselect" && value) {
		const options =
			cell.filter.config?.options ||
			columns.find(({ id }) => id == cell.id).options;
		if (options) {
			value = options.find(({ id }) => id == value).label;
		}
	}
	return value ?? "";
}
