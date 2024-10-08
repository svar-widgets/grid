<script>
	import { Grid, defaultMenuOptions } from "../../src";
	import { ActionMenu } from "wx-svelte-menu";

	let api;

	import { getData } from "../data";
	const { data } = getData();

	import ButtonCell from "../custom/ButtonCell.svelte";
	import IconCell from "../custom/IconCell.svelte";

	const columns = [
		{ id: "menu", cell: IconCell, width: 50 },
		{ id: "firstName", header: "First Name", editor: "text" },
		{ id: "lastName", header: "Last Name", editor: "text" },
		{ id: "email", header: "Email", editor: "text" },
		{
			id: "city",
			header: "City",
			cell: ButtonCell,
			editor: "text",
			width: 260,
		},
	];

	import { getContext } from "svelte";
	const helpers = getContext("wx-helpers");

	function action(action, ev) {
		const { row, column } = ev.detail;
		const event = `Event: ${action}\n`;
		const r = `Row ID: ${row}\n`;
		const c = `Col ID: ${column}\n`;

		helpers.showNotice({ text: event + r + c });
	}

	const handleClicks = ev => {
		const option = ev.detail.action;
		if (option) {
			const id = api.getState().selected;
			switch (option.id) {
				case "add:before":
					api.exec("add-row", { row: {}, before: id });
					break;
				case "add:after":
					api.exec("add-row", { row: {}, after: id });
					break;
				case "copy":
					api.exec("add-row", {
						row: { ...api.getRow(id), id: null },
						after: id,
					});
					break;
				case "delete":
					api.exec("delete-row", { id });
					break;
			}
		}
	};
</script>

<div class="demo" style="padding: 20px;">
	<div style="height: 320px; max-width: 1900px;">
		<ActionMenu
			resolver={id => id}
			{api}
			at={"point"}
			dataKey={"actionId"}
			options={defaultMenuOptions}
			on:click={handleClicks}
		>
			<Grid
				bind:api
				cellStyle={(row, col) =>
					col.id == "city" ? "button_cell" : ""}
				{data}
				{columns}
				on:custom-button={ev => action("button", ev)}
				on:custom-icon={ev => action("icon", ev)}
			/>
		</ActionMenu>
	</div>
</div>

<style>
	.demo :global(.button_cell) {
		padding: 2px 8px;
	}
	.demo :global(.button_cell button) {
		float: right;
	}
</style>
