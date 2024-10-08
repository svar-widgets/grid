export function getStyle(width, flexgrow, fixed, left, height) {
	const w = width ? `width:${width}px;` : "";
	const mw = width ? `min-width:${width}px;` : "";
	const fl = flexgrow ? `flex-grow:${flexgrow};` : "";
	const h = height ? `height:${height}px;` : "";

	const fx = fixed ? `position:sticky;left:${left}px;` : "";

	return `${mw}${w}${h}${fl}${fx}`;
}

export function getCssName(column, cell, columnStyle) {
	let css = "";
	css += column.fixed
		? column.fixed === -1
			? "wx-shadow "
			: "wx-fixed "
		: "";
	css += cell.rowspan > 1 ? "wx-rowspan " : "";
	css += cell.colspan > 1 ? "wx-colspan " : "";
	css += cell.vertical ? "wx-vertical " : "";
	css += columnStyle ? columnStyle(column) + " " : "";
	return css;
}
