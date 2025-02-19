<script>
	import { getContext } from "svelte";
	import { getStyle, getCssName } from "../helpers/columnWidth";

	const api = getContext("grid-store");

	let { cell, column, row, columnStyle } = $props();

	let style = $derived(
		getStyle(
			cell.width,
			cell.flexgrow,
			column.fixed,
			column.left,
			cell.right ?? column.right,
			cell.height
		)
	);

	let css = $derived(getCssName(column, cell, columnStyle));

	function getCell() {
		return Object.fromEntries(
			Object.entries(cell).filter(([key]) => key !== "cell")
		);
	}
</script>

<div
	class="wx-cell {css} {cell.css || ''}"
	class:wx-fixed-right={column.fixed && column.fixed.right}
	{style}
>
	{#if !column.collapsed && !cell.collapsed}
		{#if cell.cell}
			<cell.cell
				{api}
				cell={getCell()}
				{column}
				{row}
				onaction={({ action, data }) => api.exec(action, data)}
			/>
		{:else}
			<div class="wx-text">{cell.text || ""}</div>
		{/if}
	{/if}
</div>

<style>
	:global(.wx-measure-cell-footer),
	:global(.wx-print-cell-footer),
	.wx-cell {
		padding: 8px;
		display: flex;
		align-items: center;
		font-weight: var(--wx-header-font-weight);
		background: var(--wx-table-header-background);
		overflow: hidden;
	}

	:global(.wx-print-cell-footer) {
		display: table-cell;
	}

	.wx-cell:not(:last-child) {
		border-right: var(--wx-table-footer-cell-border);
	}

	.wx-cell.wx-vertical {
		align-items: flex-end;
	}

	:global(.wx-print-cell-footer .wx-text),
	.wx-text {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	:global(.wx-print-cell-footer.wx-vertical .wx-text),
	.wx-vertical .wx-text {
		transform: rotate(-90deg) translateY(100%);
		transform-origin: left bottom;
		text-overflow: clip;
		overflow: unset;
	}

	:global(.wx-print-cell-footer.wx-vertical .wx-text) {
		display: block;
	}

	.wx-cell.wx-shadow {
		clip-path: inset(0px -15px 0px 0px);
		border-right: var(--wx-table-fixed-column-border);
	}

	.wx-cell.wx-fixed-right.wx-shadow {
		border-right: var(--wx-table-cell-border);
		border-left: var(--wx-table-fixed-column-border);
	}

	.wx-cell.wx-fixed-right.wx-cell:last-child {
		border-right: none;
	}

	.wx-shadow,
	.wx-fixed {
		z-index: 3;
	}

	.wx-rowspan {
		z-index: 2;
	}

	.wx-rowspan.wx-shadow,
	.wx-rowspan.wx-fixed,
	.wx-colspan.wx-shadow,
	.wx-colspan.wx-fixed {
		z-index: 4;
	}

	:global(.wx-f-row:not(:last-child)) .wx-cell:not(.wx-rowspan) {
		border-bottom: var(--wx-table-header-cell-border);
	}
</style>
