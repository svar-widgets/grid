<script lang="ts">
	import { getContext } from "svelte";
	import {
		getRenderValue,
		getHeaderFooterPrintColumns,
		getPrintCellStyle,
	} from "@svar-ui/grid-store";
	import type {
		IRenderColumn,
		IRenderHeaderCell,
		IRow,
	} from "@svar-ui/grid-store";
	import HeaderFooter from "./HeaderFooter.svelte";
	import type {
		IInnerApi,
		TCellStyle,
		TColumnStyle,
		TRowStyle,
	} from "../../types";

	type Props = {
		columns: IRenderColumn[];
		rowStyle?: TRowStyle | null;
		columnStyle?: TColumnStyle | null;
		cellStyle?: TCellStyle | null;
		header?: boolean;
		footer?: boolean;
		reorder?: unknown;
	};

	let {
		columns,
		rowStyle,
		columnStyle,
		cellStyle,
		header,
		footer,
		reorder,
	}: Props = $props();

	const api = getContext<IInnerApi>("grid-store");
	const { flatData: data, _sizes: sizes } = api.getState();

	const headerColumns = $derived(
		header &&
			getHeaderFooterPrintColumns(
				columns,
				"header",
				sizes.headerRowHeights!
			)
	);
	const footerColumns = $derived(
		footer &&
			getHeaderFooterPrintColumns(
				columns,
				"footer",
				sizes.footerRowHeights!
			)
	);

	function buildCellCss(row: IRow, column: IRenderColumn) {
		let css = "";
		css += columnStyle ? " " + columnStyle(column) : "";
		css += cellStyle ? " " + cellStyle(row, column) : "";
		return css;
	}

	function isDraggableIcon(row: IRow, column: IRenderColumn) {
		return typeof column.draggable === "function"
			? column.draggable(row, column) !== false
			: column.draggable;
	}
</script>

<table
	class="wx-print-grid"
	class:wx-flex-columns={columns.some(c => c.flexgrow)}
>
	{#if header}
		<thead>
			<HeaderFooter
				columns={headerColumns as IRenderHeaderCell[][]}
				type={"header"}
				{columnStyle}
			/>
		</thead>
	{/if}

	<tbody>
		{#each data as row}
			<tr
				class={"wx-row" + (rowStyle ? " " + rowStyle(row) : "")}
				style={`height:${row.rowHeight || sizes.rowHeight}px;`}
			>
				{#each columns as column (column.id)}
					{#if !column.collapsed}
						<td
							class="wx-print-cell wx-cell {buildCellCss(
								row,
								column
							)}"
							style={getPrintCellStyle(
								column,
								sizes.columnWidth!
							)}
						>
							{#if reorder && column.draggable}
								<span class="wx-print-draggable">
									{#if isDraggableIcon(row, column)}
										<i class="wxi-drag"></i>
									{/if}
								</span>
							{/if}
							{#if column.treetoggle}
								<span style="margin-left:{row.$level * 28}px;"
								></span>
								{#if row.$count}
									<i
										class="wx-print-grid-tree-toggle wxi-menu-{row.open !==
										false
											? 'down'
											: 'right'}"
									></i>
								{/if}
							{/if}
							{#if column.cell}
								<column.cell {api} {row} {column} />
							{:else}
								<span>{getRenderValue(row, column)}</span>
							{/if}
						</td>
					{/if}
				{/each}
			</tr>
		{/each}
	</tbody>
	{#if footer}
		<tfoot>
			<HeaderFooter
				columns={footerColumns as IRenderHeaderCell[][]}
				type={"footer"}
				{columnStyle}
			/>
		</tfoot>
	{/if}
</table>

<style>
	.wx-flex-columns {
		width: 100%;
	}
</style>
