<script>
	import { getContext } from "svelte";
	import HeaderCell from "./HeaderCell.svelte";
	import FooterCell from "./FooterCell.svelte";

	let {
		deltaLeft,
		contentWidth,
		columns,
		type = "header",
		columnStyle,
	} = $props();

	const api = getContext("grid-store");
	const { _sizes: sizes } = api.getReactiveState();
	let rowHeights = $derived($sizes[`${type}RowHeights`]);

	let renderedHeader = $derived.by(() => {
		let res = [];
		if (columns.length) {
			const rowsCount = columns[0][type].length;
			for (let ri = 0; ri < rowsCount; ri++) {
				let inSpan = 0;
				res.push([]);
				columns.forEach(col => {
					if (!inSpan) {
						res[ri].push(col[type][ri]);
					}

					if (col[type][ri].colspan > 1) {
						inSpan = col[type][ri].colspan - 1;
					} else if (inSpan) inSpan--;
				});
			}
		}
		return res;
	});

	function getColumn(id) {
		return columns.find(c => c.id === id);
	}

	function isLast(cell, ind) {
		if (cell.rowspan) ind += cell.rowspan - 1;
		return ind === renderedHeader.length - 1;
	}
</script>

<div
	class={`wx-${type}`}
	style="padding-left:{deltaLeft}px;width:{contentWidth}px;"
>
	{#each renderedHeader as row, i}
		<div
			class={type === "header" ? "wx-h-row" : "wx-f-row"}
			style="height:{rowHeights[i]}px; display: flex"
		>
			{#each row as cell (cell.id)}
				{#if type === "header"}
					<HeaderCell
						{cell}
						{columnStyle}
						column={getColumn(cell.id)}
						row={i}
						lastRow={isLast(cell, i)}
					/>
				{:else}
					<FooterCell
						{cell}
						{columnStyle}
						column={getColumn(cell.id)}
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

	.wx-h-row:not(:last-child) {
		border-bottom: var(--wx-table-header-cell-border);
	}

	.wx-f-row:not(:last-child) {
		border-bottom: var(--wx-table-footer-cell-border);
	}
</style>
