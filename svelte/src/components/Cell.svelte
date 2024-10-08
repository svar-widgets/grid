<script>
	import { getStyle } from "../helpers/columnWidth";
	import { getRenderValue } from "wx-grid-store";

	export let row;
	export let col;
	export let cellStyle = null;
	export let columnStyle = null;

	let style, css;
	$: style = getStyle(col.width, col.flexgrow, col.fixed, col.left);

	function buildCellCss(columnStyle, cellStyle) {
		let css = "wx-cell";
		css += columnStyle ? " " + columnStyle(col) : "";
		css += cellStyle ? " " + cellStyle(row, col) : "";
		return css;
	}
	// params are needed for css update
	$: css = buildCellCss(columnStyle, cellStyle);
</script>

<div
	class={css}
	class:wx-shadow={col.fixed === -1}
	{style}
	data-row-id={row.id}
	data-col-id={col.id}
>
	{#if col.treetoggle}
		<div class="wx-tree-cell">
			<span style="margin-left:{row.$level * 28}px;" />
			{#if row.$count}
				<i
					data-action="toggle-row"
					class="wx-table-tree-toggle wxi-menu-{row.open !== false
						? 'down'
						: 'right'}"
				/>
			{/if}
			<slot>{getRenderValue(row, col)}</slot>
		</div>
	{:else}
		<slot>{getRenderValue(row, col)}</slot>
	{/if}
</div>

<style>
	:global(.wx-measure-cell-body),
	.wx-cell {
		background: inherit;
		box-sizing: border-box;
		padding: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.wx-tree-cell {
		display: flex;
	}

	:global(.wx-measure-cell-body),
	.wx-cell:not(:last-child) {
		border-right: var(--wx-table-cell-border);
	}

	.wx-shadow.wx-cell {
		border-right: var(--wx-table-fixed-column-right-border);
		clip-path: inset(0px -15px 0px 0px);
		z-index: 1;
	}

	.wx-table-tree-toggle {
		font-size: 20px;
		cursor: pointer;
		margin: 0 8px 0 0;
		display: inline-block;
	}
</style>
