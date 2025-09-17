<script>
	import { getContext } from "svelte";
	import { getPrintCellStyle, getPrintFilterValue } from "@svar-ui/grid-store";

	let { columns, type, columnStyle } = $props();

	const api = getContext("grid-store");
	const { filterValues, _columns, _sizes: sizes } = api.getState();

	function getColumnCss(column) {
		return columnStyle ? " " + columnStyle(column) : "";
	}
</script>

{#each columns as row, i}
	<tr>
		{#each row as cell (cell.id)}
			{@const column = _columns.find(c => c.id == cell.id)}
			<th
				style={getPrintCellStyle(cell, sizes.columnWidth)}
				class="wx-print-cell-{type} {getColumnCss(column)}"
				class:wx-print-cell-filter={cell.filter}
				class:wx-vertical={cell.vertical}
				rowspan={cell.rowspan}
				colspan={cell.colspan}
			>
				{#if cell.cell}
					<cell.cell
						{api}
						cell={Object.fromEntries(
							Object.entries(cell).filter(
								([key]) => key !== "cell"
							)
						)}
						{column}
						row={i}
					/>
				{:else if cell.filter}
					<div class="wx-print-filter">
						{getPrintFilterValue(filterValues, _columns, cell)}
					</div>
				{:else}
					<div class="wx-text">{cell.text ?? ""}</div>
				{/if}
			</th>
		{/each}
	</tr>
{/each}

<style>
	:global(.wx-print-grid .wx-vertical) {
		vertical-align: bottom;
	}
</style>
