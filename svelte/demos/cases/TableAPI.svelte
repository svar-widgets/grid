<script>
	import { getContext } from "svelte";
	import { Grid } from "../../src";
	import { Button } from "wx-svelte-core";

	import { getData } from "../data";
	const { allData } = getData();

	let data = $state(allData.slice(0, 10));

	const otherData = allData.slice(0, 5);

	const columns = [
		{
			id: "id",
			header: { rowspan: 2 },
			width: 50,
		},
		{
			id: "city",
			width: 100,
			header: { text: "City", rowspan: 2 },
			footer: "City",
			sort: true,
		},
		{
			id: "firstName",
			header: [
				{
					text: "First Name",
				},
				{ filter: "text" },
			],
			footer: "First Name",
			editor: "text",
			width: 150,
			sort: true,
		},
		{
			id: "lastName",
			header: [
				{
					text: "Last Name",
				},
				{ filter: "text" },
			],
			footer: "Last Name",
			editor: "text",
			width: 150,
			sort: true,
		},
		{
			id: "email",
			header: { text: "Email", rowspan: 2 },
			footer: "Email",
			sort: true,
		},
	];

	const helpers = getContext("wx-helpers");

	let tbl = $state(),
		selected = $state();

	function init(tbl) {
		const rState = tbl.getReactiveState();
		selected = rState.selectedRows[0];

		tbl.intercept("select-row", ev => {
			if (ev.id == 1) {
				helpers.showNotice({
					text: "Cannot be selected: " + ev.id,
					type: "warning",
				});
				return false;
			}
		});
	}

	function addRow() {
		tbl.exec("add-row", { row: {} });
	}
	function deleteRow() {
		const id = tbl.getState().selectedRows[0];
		if (id) {
			tbl.exec("delete-row", { id });
		}
	}
	function onSelectRow(ev) {
		helpers.showNotice({ text: "Selected: " + ev.id, type: "info" });
	}
</script>

<div style="padding: 20px;">
	<p>
		<Button onclick={addRow} type="primary">Add row</Button>
		<Button onclick={deleteRow}>Delete row</Button>
		<Button onclick={() => (data = otherData)}>Other Data</Button>
	</p>
	<div style="max-width: 800px;">
		<Grid
			{data}
			{columns}
			{init}
			bind:this={tbl}
			onselectrow={onSelectRow}
		/>
	</div>
	<div class="status">Selected: {$selected || "none"}</div>
</div>

<style>
	.status {
		padding: 6px 0;
	}
</style>
