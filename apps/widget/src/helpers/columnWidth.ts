import type { IRenderColumn, IRenderHeaderCell } from "@svar-ui/grid-store";

type TFixed = { left?: number; right?: number } | undefined;

export function getStyle(
	width: number | undefined,
	flexgrow: number | undefined,
	fixed: TFixed,
	left: number | undefined,
	right: number | undefined,
	height?: number
): string {
	const w = width ? `width:${width}px;` : "";
	const mw = width ? `min-width:${width}px;` : "";
	const fl = flexgrow ? `flex-grow:${flexgrow};` : "";
	const h = height ? `height:${height}px;` : "";

	let fx = "";
	if (fixed) {
		if (fixed.left) fx = `position:sticky;left:${left}px;`;
		if (fixed.right) fx = `position:sticky;right:${right}px;`;
	}

	return `${mw}${w}${h}${fl}${fx}`;
}

export function getCssName(
	column: IRenderColumn,
	cell: IRenderHeaderCell,
	columnStyle?: ((column: IRenderColumn) => string) | null
): string {
	let css = "";

	if (column.fixed) {
		const fixed = column.fixed as Record<string, number>;
		for (const pos in fixed) {
			let isShadow = fixed[pos] === -1;
			if (!isShadow && fixed.leftSize && cell.colspan) {
				const spanIndex = cell.colspan + column._colindex - 1;
				isShadow = spanIndex === fixed.leftSize;
			}
			css += isShadow ? "wx-shadow " : "wx-fixed ";
		}
	}
	css += (cell.rowspan ?? 0) > 1 ? "wx-rowspan " : "";
	css += (cell.colspan ?? 0) > 1 ? "wx-colspan " : "";
	css += cell.vertical ? "wx-vertical " : "";
	css += columnStyle ? columnStyle(column) + " " : "";
	return css;
}
