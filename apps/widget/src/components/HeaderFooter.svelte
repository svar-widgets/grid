<script lang="ts">
	import { getContext } from "svelte";
	import HeaderCell from "./HeaderCell.svelte";
	import FooterCell from "./FooterCell.svelte";
	import { isCommunity } from "@svar-ui/grid-store";
	import type { TColumnType } from "@svar-ui/grid-store";
	import type { TID } from "@svar-ui/lib-state";
	import type {
		IInnerApi,
		TColumnStyle,
		TLayoutColumn,
		TLayoutHeaderCell,
	} from "../types";

	type Props = {
		deltaLeft: number;
		contentWidth: number;
		columns: TLayoutColumn[];
		type?: TColumnType;
		columnStyle?: TColumnStyle | null;
		bodyHeight?: number;
		viewportWidth?: number;
		leftColumnsWidth?: number;
		rightColumnsWidth?: number;
	};

	let {
		deltaLeft,
		contentWidth,
		columns,
		type = "header",
		columnStyle,
		bodyHeight,
		...restProps
	}: Props = $props();

	const api = getContext<IInnerApi>("grid-store");
	const { _sizes: sizes, split } = api.getReactiveState();
	let rowHeights = $derived($sizes[`${type}RowHeights`]!);

	let renderedHeader = $derived.by(() => {
		let res: TLayoutHeaderCell[][] = [];
		if (columns.length) {
			const rowsCount = columns[0][type]!.length;
			for (let ri = 0; ri < rowsCount; ri++) {
				let inSpan = 0;
				let left = 0;
				res.push([]);
				columns.forEach((col, ci) => {
					const cell: TLayoutHeaderCell = { ...col[type]![ri] };
					if (!inSpan) {
						cell.left = left;
						res[ri].push(cell);
					}

					left += col.width!;

					if (cell.colspan! > 1) {
						inSpan = cell.colspan! - 1;

						if (!isCommunity()) {
							if (col.right) {
								// if column is fixed on the right and have colspan we need to recalculate right position
								let right = col.right;
								for (let i = 1; i < cell.colspan!; i++) {
									right -= columns[ci + i].width!;
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

	function getColumn(id: TID | undefined) {
		return columns.find(c => c.id === id) as TLayoutColumn;
	}

	function isLast(cell: TLayoutHeaderCell, ind: number) {
		if (cell.rowspan) ind += cell.rowspan - 1;
		return ind === renderedHeader.length - 1;
	}

	function isSort(
		cell: TLayoutHeaderCell,
		ind: number,
		column: TLayoutColumn
	) {
		for (let i = renderedHeader.length - 1; i >= 0; i--) {
			const cell = column.header![i];
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
						{deltaLeft}
						{...restProps}
					/>
				{:else}
					<FooterCell {cell} {columnStyle} {column} row={i} />
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
