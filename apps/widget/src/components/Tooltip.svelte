<script lang="ts">
	import type { Component, ComponentProps } from "svelte";
	import { getRenderValue } from "@svar-ui/grid-store";
	import type { IApi, IColumn, IRow } from "@svar-ui/grid-store";
	import { Tooltip as CoreTooltip } from "@svar-ui/svelte-core";
	import { getID } from "@svar-ui/lib-dom";

	type Props = Omit<ComponentProps<typeof CoreTooltip>, "content"> & {
		api?: IApi;
		// show the tooltip only when the cell text is cut
		overflow?: boolean;
		content?: Component<{
			data: {
				row: IRow;
				column: IColumn;
			};
		}> | null;
	};

	let {
		api,
		at = "point",
		overflow = false,
		content: Content = null,
		resolver = defaultResolver,
		...restProps
	}: Props = $props();

	function defaultResolver(element: HTMLElement): any {
		if (!api) return null;

		const rowId = getID(element, "data-row-id");
		const columnId = getID(element, "data-col-id");

		if (!rowId || !columnId) return null;

		const row = api.getRow(rowId);
		const column = api.getColumn(columnId);

		if (column.tooltip === false) return null;
		if (overflow && element.scrollWidth <= element.clientWidth) return null;

		if (Content) {
			return { data: { row, column } };
		} else {
			if (typeof column.tooltip === "function") {
				return column.tooltip(row);
			}
			return getRenderValue(row, column);
		}
	}
</script>

<CoreTooltip
	{at}
	content={Content as Component<any> | null}
	{resolver}
	{...restProps}
/>
