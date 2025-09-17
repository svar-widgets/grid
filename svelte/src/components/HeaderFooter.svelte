<script>
	import { getContext } from "svelte";
	import HeaderCell from "./HeaderCell.svelte";
	import FooterCell from "./FooterCell.svelte";
	import { isCommunity } from "@svar-ui/grid-store";

	let {
		deltaLeft,
		contentWidth,
		columns,
		type = "header",
		columnStyle,
		bodyHeight,
	} = $props();

	const api = getContext("grid-store");
	const { _sizes: sizes, split } = api.getReactiveState();
	let rowHeights = $derived($sizes[`${type}RowHeights`]);

	let renderedHeader = $derived.by(() => {
		let res = [];
		if (columns.length) {
			const rowsCount = columns[0][type].length;
			for (let ri = 0; ri < rowsCount; ri++) {
				let inSpan = 0;
				res.push([]);
				columns.forEach((col, ci) => {
					const cell = { ...col[type][ri] };
					if (!inSpan) {
						res[ri].push(cell);
					}

					if (cell.colspan > 1) {
						inSpan = cell.colspan - 1;

						if (!isCommunity()) {
							if (col.right) {
								// if column is fixed on the right and have colspan we need to recalculate right position
								let right = col.right;
								for (let i = 1; i < cell.colspan; i++) {
									right -= columns[ci + i].width;
								}
								cell.right = right;
							}
						}
					} else if (inSpan) inSpan--;
				});
			}
		}
		return res;
	});

	const hasSplit = $derived($split?.left || $split?.right);

	function getColumn(id) {
		return columns.find(c => c.id === id);
	}

	function isLast(cell, ind) {
		if (cell.rowspan) ind += cell.rowspan - 1;
		return ind === renderedHeader.length - 1;
	}

	function isSort(cell, ind, column) {
		if (!column.sort) return false;
		for (let i = renderedHeader.length - 1; i >= 0; i--) {
			const cell = column.header[i];
			if (!cell.filter && !cell._hidden) return ind === i;
		}
		return isLast(cell, ind);
	}
</script>

<div
	class={`wx-${type}`}
	style="padding-left:{deltaLeft}px;width:{contentWidth}px;"
	role="rowgroup"
>
	{#each renderedHeader as row, i}
		<div
			class={type === "header" ? "wx-h-row" : "wx-f-row"}
			style="height:{rowHeights[i]}px; display: flex"
			role="row"
		>
			{#each row as cell (cell.id)}
				{@const column = getColumn(cell.id)}
				{#if type === "header"}
					<HeaderCell
						{cell}
						{columnStyle}
						{column}
						row={i}
						lastRow={isLast(cell, i)}
						{bodyHeight}
						sortRow={isSort(cell, i, column)}
						{hasSplit}
					/>
				{:else}
					<FooterCell
						{cell}
						{columnStyle}
						column={getColumn(cell.id)}
						row={i}
					/>
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style>
	.wx-header,
	.wx-footer {
		font-weight: 500;
	}

	.wx-header {
		top: 0;
		border-bottom: var(--wx-table-header-border);
	}

	.wx-footer {
		position: sticky;
		z-index: 2;
		bottom: 0;
		border-top: var(--wx-table-header-border);
	}
</style>
