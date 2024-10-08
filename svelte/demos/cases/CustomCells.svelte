<script>
	import { Grid } from "../../src";

	import { getData } from "../data";
	const { data } = getData();

	import CheckboxCell from "../custom/CheckboxCell.svelte";
	import AvatarCell from "../custom/AvatarCell.svelte";

	import { getContext } from "svelte";
	const helpers = getContext("wx-helpers");

	const columns = [
		{ id: "id", width: 50 },
		{ id: "checked", cell: CheckboxCell, width: 36 },
		{ id: "avatar", cell: AvatarCell, width: 300 },
	];

	function action(action, ev) {
		const { value, row, column } = ev.detail;
		const event = `event: ${action}\n`;
		const val = `value: ${value}\n`;
		const r = `row ID: ${row}\n`;
		const c = `col ID: ${column}\n`;
		helpers.showNotice({ text: event + val + r + c });
	}
</script>

<div class="demo" style="padding: 20px;">
	<h4>Table with custom cells and templates</h4>
	<div style="height: 320px; max-width: 800px;">
		<Grid
			sizes={{ rowHeight: 70 }}
			header={!!false}
			{data}
			{columns}
			cellStyle={(row, col) => {
				let css = "";
				if (col.id == "id") css = "vcenter";
				else if (col.id == "checked" || col.id == "city")
					css = "vcentercontrol";
				return css;
			}}
			on:custom-combo={ev => action("combo", ev)}
			on:custom-check={ev => action("checkbox", ev)}
		/>
	</div>
</div>

<style>
	.demo :global(.vcenter) {
		line-height: 40px;
	}

	.demo :global(.vcentercontrol) {
		padding-top: 18px !important;
	}
</style>
