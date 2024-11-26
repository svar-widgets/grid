<script>
	import { getStyle } from "../helpers/columnWidth";
	import { getRenderValue } from "wx-grid-store";

	/**
	 * @typedef {Object} Props
	 * @property {any} row
	 * @property {any} col
	 * @property {any} [cellStyle]
	 * @property {any} [columnStyle]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { row, col, cellStyle = null, columnStyle = null, children } = $props();

	let style = $derived(
			getStyle(col.width, col.flexgrow, col.fixed, col.left)
		),
		css = $derived(buildCellCss(columnStyle, cellStyle));

	function buildCellCss(columnStyle, cellStyle) {
		let css = "wx-cell";
		css += columnStyle ? " " + columnStyle(col) : "";
		css += cellStyle ? " " + cellStyle(row, col) : "";
		return css;
	}
	// params are needed for css update
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
			<span style="margin-left:{row.$level * 28}px;"></span>
			{#if row.$count}
				<i
					data-action="toggle-row"
					class="wx-table-tree-toggle wxi-menu-{row.open !== false
						? 'down'
						: 'right'}"
				></i>
			{/if}
			{#if children}{@render children()}{:else}{getRenderValue(
					row,
					col
				)}{/if}
		</div>
	{:else if children}{@render children()}{:else}{getRenderValue(
			row,
			col
		)}{/if}
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
