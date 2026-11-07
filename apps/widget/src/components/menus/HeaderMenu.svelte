<script lang="ts">
	import type { Component, Snippet } from "svelte";
	import { ContextMenu, registerMenuItem } from "@svar-ui/svelte-menu";
	import type { IMenuOption, IMenuOptionClick } from "@svar-ui/svelte-menu";
	import type { IApi, IRenderColumn } from "@svar-ui/grid-store";
	import HeaderMenuItem from "./HeaderMenuItem.svelte";

	type Props = {
		columns?: { [key: string]: boolean } | null;
		api?: IApi;
		children?: Snippet;
	};

	let { columns = null, api, children }: Props = $props();

	registerMenuItem("table-header", HeaderMenuItem as Component<any>);

	function getLabel(col: IRenderColumn) {
		for (let i = col.header!.length - 1; i >= 0; i--) {
			const text = col.header![i].text;
			if (text) return text;
		}
		return col.id;
	}

	function headerMenuClick(e: IMenuOptionClick) {
		const col = e.action as { id: string | number; hidden?: boolean };
		if (col) {
			api!.exec("hide-column", { id: col.id, mode: !col.hidden });
		}
	}

	function open(id: string | number) {
		return id;
	}

	let rColumns: ReturnType<IApi["getReactiveState"]>["_columns"];
	const headerMenuOptions = $derived.by(() => {
		if (api) {
			rColumns = api.getReactiveState()._columns;

			const included = columns
				? $rColumns.filter(c => columns[c.id!])
				: $rColumns;

			return included.map(c => {
				const text = getLabel(c);
				return {
					id: c.id,
					text,
					type: "table-header",
					hidden: c.hidden,
				};
			});
		} else {
			return [];
		}
	});
</script>

<ContextMenu
	dataKey="headerId"
	options={headerMenuOptions as IMenuOption[]}
	onclick={headerMenuClick}
	at="point"
	resolver={open}
>
	{@render children?.()}
</ContextMenu>
