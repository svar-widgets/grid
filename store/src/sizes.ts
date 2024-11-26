import type { IRenderColumn, TColumnType, IColumn, IRow } from "./types";

import { getRenderValue } from "./export";

const BASE_TREE_OFFSET = 28; // base offset for tree levels
const SORT_EL_OFFSET = 16; // offset for sort arrows

export function suggestSkin() {
	// FIXME :: Svelte-kit
	if (typeof document === "undefined") return "willow";

	const skin = document.querySelector('[class^="wx"][class$="theme"]');
	if (!skin) return "willow";

	return skin.className.substr(3, skin.className.length - 9);
}

function getTextSize(
	text: string | number | (string | number)[],
	css: string,
	skin: string,
	offsets?: number[],
	basewidth?: string | number
): { width: number; height: number } {
	const container = document.createElement("div");
	const content = document.createElement("div");

	const target = document.body;
	basewidth = basewidth ? `${basewidth}px` : "auto";
	let width;
	let height;

	content.className = css;
	container.classList.add(`wx-${skin}-theme`);
	container.style.cssText = `height:auto;position:absolute;top:0px;left:100px;overflow:hidden;width=${basewidth};white-space:nowrap;`;

	container.appendChild(content);
	target.appendChild(container);

	if (typeof text != "object") text = [text];

	for (let i = 0; i < text.length; i++) {
		content.innerText = text[i] + "";

		const rect = container.getBoundingClientRect();
		const rectWidth =
			Math.ceil(rect.width) +
			(offsets && offsets.length ? offsets[i] : 0);
		const rectHeight = Math.ceil(rect.height);

		width = Math.max(width || 0, rectWidth);
		height = Math.max(height || 0, rectHeight);
	}

	container.remove();

	return { width, height };
}

export function getHeaderFooterHeights(
	columns: IRenderColumn[],
	condition: TColumnType,
	rowsCount: number,
	defaultHeight: number,
	skin: string
) {
	const headerRowHeights: number[] = [];

	for (let c = 0; c < columns.length; c++) {
		const column = columns[c][condition];
		const length = column.length;

		for (let r = 0; r < length; r++) {
			const { text, vertical, collapsed, rowspan, css } = column[r];

			if (!text) {
				headerRowHeights[r] = Math.max(
					headerRowHeights[r] || 0,
					defaultHeight
				);
				continue;
			}

			let height = 0;

			if (vertical && !collapsed) {
				let cellCss = `wx-measure-cell-${condition} wx-measure-vertical`;
				cellCss += css ? ` ${css}` : "";

				height = getTextSize(text, cellCss, skin).width;

				// need to find out if current vertical cell is a rowspan
				if ((rowspan > 1 || !column[r + 1]) && rowsCount > r + 1) {
					// need to calculate previous sum of same rows heights.
					// if sum is less then current height than need to add diff btw sum and height to each cell
					const count = rowspan || rowsCount - r;
					const prevHeight = headerRowHeights
						.slice(r, r + count)
						.reduce((sum, value) => sum + value, 0);

					if (prevHeight < height) {
						const diff = Math.ceil((height - prevHeight) / count);
						for (let i = r; i < r + count; i++)
							headerRowHeights[i] =
								(headerRowHeights[i] || defaultHeight) + diff;
					}

					continue;
				}
			}

			headerRowHeights[r] = Math.max(
				headerRowHeights[r] || defaultHeight,
				height
			);
		}
	}

	return headerRowHeights;
}

export function getColumnWidth(col: IColumn, data: IRow[], skin: string) {
	const text = [];
	const offsets = [];

	let css = "wx-measure-cell-body";

	css += col.css ? ` ${col.css}` : "";

	for (let i = 0; i < data.length; i++) {
		const row = data[i];
		const colText = getRenderValue(row, col);

		if (colText) {
			text.push(colText);

			if (col.treetoggle)
				offsets.push(
					data[i].$level * BASE_TREE_OFFSET +
						(data[i].$count ? BASE_TREE_OFFSET : 0)
				);
		}
	}

	return getTextSize(text, css, skin, offsets).width;
}

export function getHeaderColWidth(column: IColumn, skin: string): number {
	const css = "wx-measure-cell-header";
	const sortElOffset = column.sort ? SORT_EL_OFFSET : 0;
	let header = column.header;
	if (typeof header === "string")
		return getTextSize(header, css, skin).width + sortElOffset;

	let width: number;

	if (!Array.isArray(header)) header = [header];

	for (let i = 0; i < header.length; i++) {
		const cell = header[i];
		const text = typeof cell === "string" ? cell : cell.text;
		const style = css + (typeof cell === "string" ? "" : ` ${cell.css}`);
		let currWidth = getTextSize(text, style, skin).width;
		if (i === header.length - 1) currWidth += sortElOffset;

		width = Math.max(width || 0, currWidth);
	}

	return width;
}
