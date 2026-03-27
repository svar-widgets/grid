export function getStyle(width, flexgrow, fixed, left, right, height) {
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

export function getCssName(column, cell, columnStyle) {
	let css = "";

	if (column.fixed) {
		for (const pos in column.fixed) {
			let isShadow = column.fixed[pos] === -1;
			if (!isShadow && column.fixed.leftSize && cell.colspan) {
				const spanIndex = cell.colspan + column._colindex - 1;
				isShadow = spanIndex === column.fixed.leftSize;
			}
			css += isShadow ? "wx-shadow " : "wx-fixed ";
		}
	}
	css += cell.rowspan > 1 ? "wx-rowspan " : "";
	css += cell.colspan > 1 ? "wx-colspan " : "";
	css += cell.vertical ? "wx-vertical " : "";
	css += columnStyle ? columnStyle(column) + " " : "";
	return css;
}
