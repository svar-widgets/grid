<script>
	import { ContextMenu, registerMenuItem } from "@svar-ui/svelte-menu";
	import HeaderMenuItem from "./HeaderMenuItem.svelte";

	let { columns = null, api, children } = $props();

	registerMenuItem("table-header", HeaderMenuItem);

	function getLabel(col) {
		for (let i = col.header.length - 1; i >= 0; i--) {
			const text = col.header[i].text;
			if (text) return text;
		}
		return col.id;
	}

	function headerMenuClick(e) {
		const col = e.action;
		if (col) {
			api.exec("hide-column", { id: col.id, mode: !col.hidden });
		}
	}

	function open(id) {
		return id;
	}

	let rColumns;
	const headerMenuOptions = $derived.by(() => {
		if (api) {
			rColumns = api.getReactiveState()._columns;

			const included = columns
				? $rColumns.filter(c => columns[c.id])
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
	options={headerMenuOptions}
	onclick={headerMenuClick}
	at="point"
	resolver={open}
>
	{@render children?.()}
</ContextMenu>
