<script>
	import { onDestroy, getContext } from "svelte";
	import { getStyle } from "../helpers/columnWidth";
	import { getRenderValue } from "@svar-ui/grid-store";

	let {
		row,
		column,
		cellStyle = null,
		columnStyle = null,
		children,
		reorder,
		focusable,
	} = $props();

	let style = $derived(
			getStyle(
				column.width,
				column.flexgrow,
				column.fixed,
				column.left,
				column.right
			)
		),
		css = $derived(buildCellCss(columnStyle, cellStyle));

	const api = getContext("grid-store");
	const { focusCell } = api.getReactiveState();

	const isDraggable = $derived(
		typeof column.draggable === "function"
			? column.draggable(row, column) !== false
			: column.draggable
	);

	let cellEl;
	$effect(() => {
		const needFocus =
			$focusCell?.row === row.id && $focusCell?.column === column.id;
		if (cellEl && focusable && needFocus) cellEl.focus();
	});

	function buildCellCss(columnStyle, cellStyle) {
		let css = "wx-cell";
		css += column.fixed
			? " " + (column.fixed === -1 ? "wx-shadow" : "wx-fixed")
			: "";
		css += columnStyle ? " " + columnStyle(column) : "";
		css += cellStyle ? " " + cellStyle(row, column) : "";
		css += column.treetoggle ? " wx-tree-cell" : "";
		return css;
	}

	function toggleFocusAction() {
		if (focusable && !$focusCell) {
			api.exec("focus-cell", {
				row: row.id,
				column: column.id,
				eventSource: "focus",
			});
		}
	}

	onDestroy(() => {
		if (focusable && $focusCell) {
			api.exec("focus-cell", { eventSource: "destroy" });
			focusable = false;
		}
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class={css}
	class:wx-shadow={(column.fixed && column.fixed.left === -1) ||
		column.fixed.right === -1}
	bind:this={cellEl}
	onfocus={toggleFocusAction}
	class:wx-fixed-right={column.fixed && column.fixed.right}
	{style}
	data-row-id={row.id}
	data-col-id={column.id}
	tabindex={focusable ? "0" : "-1"}
	role={"gridcell"}
	aria-colindex={column._colindex}
	aria-readonly={!column.editor ? true : undefined}
>
	{#if reorder && column.draggable}
		{#if isDraggable}
			<i draggable-data="true" class="wx-draggable wxi-drag"></i>
		{:else}
			<i class="wx-draggable-stub"></i>
		{/if}
	{/if}
	{#if column.treetoggle}
		<span style="margin-left:{row.$level * 28}px;"></span>
		{#if row.$count}
			<i
				data-action="toggle-row"
				class="wx-table-tree-toggle wxi-menu-{row.open !== false
					? 'down'
					: 'right'}"
			></i>
		{/if}
	{/if}
	{#if column.cell}
		<column.cell
			{api}
			{row}
			{column}
			onaction={({ action, data }) => api.exec(action, data)}
		/>
	{:else if children}{@render children()}{:else}{getRenderValue(
			row,
			column
		)}{/if}
</div>

<style>
	:global(.wx-measure-cell-body),
	:global(.wx-print-cell),
	.wx-cell {
		background: inherit;
		box-sizing: border-box;
		padding: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	:global(.wx-print-tree-cell),
	.wx-tree-cell {
		display: flex;
	}

	:global(.wx-measure-cell-body),
	.wx-cell:not(:last-child) {
		border-right: var(--wx-table-cell-border);
	}

	:global(.wx-print-draggable),
	.wx-draggable,
	.wx-draggable-stub {
		display: inline-block;
		vertical-align: middle;
		margin-right: 3px;
		font-size: 20px;
		height: 20px;
		width: 20px;
	}

	.wx-draggable {
		cursor: move;
	}

	.wx-shadow.wx-cell {
		border-right: var(--wx-table-fixed-column-border);
		clip-path: inset(0px -15px 0px 0px);
		z-index: 1;
	}

	.wx-fixed-right.wx-shadow.wx-cell {
		border-right: var(--wx-table-cell-border);
		border-left: var(--wx-table-fixed-column-border);
	}
	.wx-fixed-right.wx-shadow.wx-cell:last-child {
		border-right: none;
	}

	:global(.wx-print-grid-tree-toggle),
	.wx-table-tree-toggle {
		font-size: 20px;
		cursor: pointer;
		margin: 0 4px 0 0;
		display: inline-block;
	}

	.wx-cell[tabindex="0"]:focus {
		outline: 1px solid var(--wx-color-primary);
		outline-offset: -1px;
	}
</style>
