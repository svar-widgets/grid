<script>
	import { getContext } from "svelte";
	import { Grid, defaultMenuOptions } from "../../src";
	import { ActionMenu } from "wx-svelte-menu";

	import { getData } from "../data";

	import ButtonCell from "../custom/ButtonCell.svelte";
	import CheckboxCell from "../custom/CheckboxCell.svelte";
	import IconCell from "../custom/IconCell.svelte";
	import HeaderCheckboxCell from "../custom/HeaderCheckboxCell.svelte";
	import HeaderButtonCell from "../custom/HeaderButtonCell.svelte";

	const helpers = getContext("wx-helpers");
	let { data } = $state(getData());
	let api = $state();

	const columns = [
		{ id: "id", header: [{ cell: HeaderButtonCell }] },
		{
			id: "checked",
			cell: CheckboxCell,
			header: [{ cell: HeaderCheckboxCell }],
			width: 36,
		},
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

	function action(action, ev) {
		const { row, column, value } = ev;
		const event = `Event: ${action}\n`;
		const val = `value: ${value}\n`;
		const r = `Row ID: ${row}\n`;
		const c = `Col ID: ${column}\n`;

		helpers.showNotice({
			text: event + (action === "header-checkbox" ? val : r + c),
		});

		if (action === "header-checkbox") onHeaderCheck(ev);
	}

	function onHeaderCheck(ev) {
		const { value, eventSource } = ev;

		if (eventSource == "click") {
			data = api.getState().data.map(d => {
				d.checked = value;
				return d;
			});
		}
	}

	const handleClicks = ev => {
		const option = ev.action;
		if (option) {
			const id = api.getState().selectedRows[0];
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
			onclick={handleClicks}
		>
			<Grid
				bind:this={api}
				cellStyle={(row, col) =>
					col.id == "city" ? "button_cell" : ""}
				{data}
				{columns}
				oncustombutton={ev => action("button", ev)}
				oncustomicon={ev => action("icon", ev)}
				oncustomcheck={ev => action("checkbox", ev)}
				oncustomheadercheck={ev => action("header-checkbox", ev)}
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
