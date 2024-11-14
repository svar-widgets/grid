<script>
	import { getContext } from "svelte";
	import { resize } from "../helpers/actions/resize";
	import { getCssName, getStyle } from "../helpers/columnWidth";

	export let cell;
	export let column;
	export let row;
	export let lastRow;
	export let columnStyle;

	const api = getContext("grid-store");

	let start;

	function down(node) {
		start = cell.flexgrow ? node.parentNode.clientWidth : cell.width;
	}

	function move(dx) {
		api.exec("resize-column", {
			id: cell.id,
			width: Math.max(1, start + dx),
		});
	}

	function sort(ev) {
		api.exec("sort-rows", { key: cell.id, add: ev.ctrlKey });
	}
	function collapse() {
		api.exec("collapse-column", { id: cell.id, row });
	}

	let style;
	$: style = getStyle(
		cell.width,
		cell.flexgrow,
		column.fixed,
		column.left,
		cell.height
	);

	let css = "";
	$: css = getCssName(column, cell, columnStyle);
</script>

{#if cell.collapsed && column.collapsed}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="wx-cell {css} {cell.css || ''} wx-collapsed"
		{style}
		on:click|stopPropagation={collapse}
		data-header-id={column.id}
	>
		<div class="wx-text">{cell.text || ""}</div>
	</div>
{:else}
	<div
		class="wx-cell {css} {cell.css || ''}"
		{style}
		data-header-id={column.id}
	>
		{#if cell.collapsible}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="wx-collapse" on:click|stopPropagation={collapse}>
				<i class="wxi-angle-{cell.collapsed ? 'down' : 'right'}" />
			</div>
		{/if}

		<div class="wx-text">{cell.text || ""}</div>

		{#if column.resize && lastRow}
			<div class="wx-grip" use:resize={{ down, move }} />
		{/if}

		{#if column.sort}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="wx-sort" on:click={sort}>
				{#if column.$sort && lastRow}
					{#if column.$sort.index > 0}
						<div class="wx-order">{column.$sort.index}</div>
					{/if}
					<i
						class="wxi-arrow-{column.$sort.order === 'asc'
							? 'up'
							: 'down'}"
					/>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	:global(.wx-measure-cell-header),
	.wx-cell {
		padding: 8px;
		position: relative;
		display: flex;
		align-items: center;
		font-weight: var(--wx-header-font-weight);
		background: var(--wx-table-header-background);
		overflow: hidden;
		gap: 10px;
		line-height: 20px;
	}

	.wx-cell.wx-vertical {
		align-items: flex-end;
	}

	:global(.wx-measure-cell-header.wx-measure-vertical) {
		padding: 8px;
	}

	:global(.wx-measure-cell-header),
	.wx-cell:not(:last-child) {
		border-right: var(--wx-table-header-cell-border);
	}

	.wx-cell:last-child {
		overflow: hidden;
	}

	.wx-text {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.wx-vertical .wx-text {
		height: 100%;
		transform: rotate(-180deg);
		writing-mode: vertical-lr;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.wx-cell.wx-shadow {
		box-shadow: var(--wx-table-fixed-column-shadow);
		clip-path: inset(0px -15px 0px 0px);
		border-right: var(--wx-table-fixed-column-right-border);
	}

	.wx-shadow,
	.wx-fixed {
		z-index: 1;
	}

	.wx-grip {
		box-sizing: border-box;
		position: absolute;
		top: 0;
		bottom: 0;
		right: -4px;
		width: 9px;
		border-left: 5px solid var(--wx-table-header-background);
		border-right: 3px solid var(--wx-table-header-background);
		background-color: var(--wx-color-primary);
		opacity: 0;
		cursor: ew-resize;
		z-index: 5;
	}

	.wx-grip::before,
	.wx-grip::after {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		width: 0;
		height: 0;
		margin: auto;
	}

	.wx-grip::before {
		border: 3px dashed transparent;
		border-right: 3px solid var(--wx-color-primary);
		right: 5px;
	}

	.wx-grip::after {
		border: 3px dashed transparent;
		border-left: 3px solid var(--wx-color-primary);
		left: 5px;
	}

	.wx-grip:hover {
		opacity: 1;
	}

	.wx-sort {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 5px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.wx-order {
		width: 16px;
		height: 16px;
		line-height: 16px;
		border-radius: 50%;
		font-size: 12px;
		text-align: center;
		color: #fff;
		background-color: #3498ff;
	}

	.wx-icon {
		padding: 5px;
		color: #3498ff;
		cursor: pointer;
	}

	.wx-rowspan {
		z-index: 6; /* because resize grips have z-index: 5 */
	}

	.wx-rowspan.wx-shadow,
	.wx-colspan.wx-shadow {
		z-index: 7;
	}

	.wx-collapse,
	.wx-collapsed {
		cursor: pointer;
		z-index: 1;
	}
</style>
