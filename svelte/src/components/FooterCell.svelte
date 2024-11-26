<script>
	import { getStyle, getCssName } from "../helpers/columnWidth";

	let { cell, column, columnStyle } = $props();

	let style = $derived(
		getStyle(
			cell.width,
			cell.flexgrow,
			column.fixed,
			column.left,
			cell.height
		)
	);

	let css = $derived(getCssName(column, cell, columnStyle));
</script>

<div class="wx-cell {css} {cell.css || ''}" {style}>
	{#if !column.collapsed && !cell.collapsed}
		<div class="wx-text">{cell.text || ""}</div>
	{/if}
</div>

<style>
	:global(.wx-measure-cell-footer),
	.wx-cell {
		padding: 8px;
		display: flex;
		align-items: center;
		font-weight: var(--wx-header-font-weight);
		background: var(--wx-table-header-background);
		overflow: hidden;
	}

	.wx-cell:not(:last-child) {
		border-right: var(--wx-table-footer-cell-border);
	}

	.wx-cell.wx-vertical {
		align-items: flex-end;
	}

	:global(.wx-measure-cell-footer.wx-measure-vertical) {
		padding: 8px;
	}

	.wx-text {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.wx-vertical .wx-text {
		transform: rotate(-90deg) translateY(100%);
		transform-origin: left bottom;
		text-overflow: clip;
		overflow: unset;
	}

	.wx-cell.wx-shadow {
		clip-path: inset(0px -15px 0px 0px);
		border-right: var(--wx-table-fixed-column-right-border);
	}

	.wx-shadow,
	.wx-fixed {
		z-index: 1;
	}

	.wx-rowspan {
		z-index: 2;
	}

	.wx-rowspan.wx-shadow,
	.wx-colspan.wx-shadow {
		z-index: 3;
	}
</style>
