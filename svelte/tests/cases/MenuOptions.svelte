<script>
	import { getData } from "../data";
	import { Grid, ContextMenu } from "../../src/";
	import { Willow, Locale } from "@svar-ui/svelte-core";
	import { getContext } from "svelte";

	const { data } = getData();

	const columns = [
		{ id: "id", width: 50 },
		{ id: "city", header: "City", width: 160, hidden: true },
		{ id: "firstName", header: "First Name", flexgrow: 1 },
		{ id: "lastName", header: "Last Name", flexgrow: 1 },
		{ id: "companyName", header: "Company", flexgrow: 1 },
	];

	let table = $state();
	function init(api) {
		table = api;
	}

	const options = [
		{
			id: "add:after",
			text: "Add after",
			icon: "wxi-table-row-plus-after",
		},
		{ id: "copy", text: "Copy", icon: "wxi-content-copy" },
		{ id: "delete", text: "Delete", icon: "wxi-delete-outline" },
		{ type: "separator" },
		{ id: "info", text: "Info", icon: "wxi-alert" },
	];

	const helpers = getContext("wx-helpers");
	function customActions(ev) {
		const action = ev.action;
		const id = table.getState().selected;
		if (action) {
			switch (action.id) {
				case "info":
					helpers.showNotice({
						text: `You clicked ${action.text} for row ${id}`,
						expire: -1,
					});
					break;
			}
		}
	}
</script>

<Willow>
	<Locale>
		<div style="padding: 20px;">
			<div>
				<ContextMenu api={table} {options} onclick={customActions}>
					<Grid {data} {columns} {init} />
				</ContextMenu>
			</div>
		</div>
	</Locale>
</Willow>
