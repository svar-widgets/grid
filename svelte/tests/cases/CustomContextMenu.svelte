<script>
	import { getData } from "../data";
	import { Grid } from "../../src/";
	import { ContextMenu } from "@svar-ui/svelte-menu";
	import { getContext } from "svelte";
	import { Willow, Locale } from "@svar-ui/svelte-core";

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
			id: "add",
			text: "Add before",
			icon: "wxi-table-row-plus-before",
		},
		{ id: "duplicate", text: "Duplicate", icon: "wxi-duplicate" },
		{ id: "delete", text: "Delete", icon: "wxi-delete-outline" },
		{ type: "separator" },
		{ id: "info", text: "Info", icon: "wxi-alert" },
		{ id: "view", text: "View", icon: "wxi-external" },
	];

	const helpers = getContext("wx-helpers");
	const handleClicks = ev => {
		const option = ev.action;
		if (option) {
			const id = table.getState().selectedRows[0];
			switch (option.id) {
				case "add":
					table.exec("add-row", { row: {}, before: id });
					break;
				case "duplicate":
					table.exec("add-row", {
						row: { ...table.getRow(id), id: null },
						after: id,
					});
					break;
				case "delete":
					table.exec("delete-row", { id });
					break;
				default:
					helpers.showNotice({
						text: `You clicked ${option.text}`,
						expire: -1,
					});
			}
		}
	};

	function getItem(id) {
		if (id) table.exec("select-row", { id });
		return id;
	}
</script>

<Willow>
	<Locale>
		<div style="padding: 20px;">
			<div>
				<ContextMenu
					{options}
					resolver={getItem}
					onclick={handleClicks}
					api={table}
					at={"point"}
				>
					<Grid {data} {columns} {init} />
				</ContextMenu>
			</div>
		</div>
	</Locale>
</Willow>
