<script>
	import { ContextMenu, registerMenuItem } from "wx-svelte-menu";
	import HeaderMenuItem from "./HeaderMenuItem.svelte";

	export let columns = null;
	export let api;

	registerMenuItem("table-header", HeaderMenuItem);

	let headerMenuOptions = [];
	let rColumns;

	$: {
		if (api) {
			if (!rColumns) rColumns = api.getReactiveState()._columns;

			const included = columns
				? $rColumns.filter(c => columns[c.id])
				: $rColumns;
			headerMenuOptions = included.map(c => {
				const text = getLabel(c);
				return {
					id: c.id,
					text,
					type: "table-header",
					hidden: c.hidden,
				};
			});
		}
	}

	function getLabel(col) {
		for (let i = col.header.length - 1; i >= 0; i--) {
			const text = col.header[i].text;
			if (text) return text;
		}
		return col.id;
	}

	function headerMenuClick(e) {
		const col = e.detail.action;
		if (col) {
			api.exec("hide-column", { id: col.id, mode: !col.hidden });
		}
	}

	function open(id) {
		return id;
	}
</script>

<ContextMenu
	dataKey="headerId"
	options={headerMenuOptions}
	on:click={headerMenuClick}
	at="point"
	resolver={open}
>
	<slot />
</ContextMenu>
