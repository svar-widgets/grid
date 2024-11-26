<script>
	import { getContext } from "svelte";
	import { getData } from "../data";
	import { Grid } from "../../src/";
	import { ContextMenu } from "wx-svelte-menu";

	const { data, flexibleColumns: columns } = getData();

	const options = [
		{
			id: "add",
			text: "Add before",
			icon: "wxi-table-row-plus-before",
		},
		{ id: "copy", text: "Copy", icon: "wxi-content-copy" },
		{ id: "delete", text: "Delete", icon: "wxi-delete-outline" },
		{ type: "separator" },
		{ id: "info", text: "Info", icon: "wxi-alert" },
		{ id: "view", text: "View", icon: "wxi-external" },
	];

	const helpers = getContext("wx-helpers");
	const handleClicks = ev => {
		const option = ev.action;
		if (option) {
			const id = table.getState().selected;
			switch (option.id) {
				case "add":
					table.exec("add-row", { row: {}, before: id });
					break;
				case "copy":
					table.exec("add-row", {
						row: { ...table.getRow(id), id: null },
						after: id,
					});
					break;
				case "delete":
					table.exec("delete-row", { id });
					break;
				default:
					helpers.showNotice({ text: `You clicked ${option.text}` });
			}
		}
	};

	let table = $state();
	function getItem(id) {
		if (id) table.exec("select-row", { id });
		return id;
	}
</script>

<div style="padding: 20px;">
	<h4>Context menu with custom actions</h4>
	<ContextMenu
		{options}
		onclick={handleClicks}
		at="point"
		resolver={getItem}
		api={table}
	>
		<Grid {data} {columns} bind:this={table} />
	</ContextMenu>
</div>
