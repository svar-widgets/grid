<script>
	import { getContext } from "svelte";
	import { Grid } from "../../src";
	import { getData } from "../data";

	import CheckboxCell from "../custom/CheckboxCell.svelte";
	import AvatarCell from "../custom/AvatarCell.svelte";
	import HeaderTextCell from "../custom/HeaderTextCell.svelte";
	import FooterTextCell from "../custom/FooterTextCell.svelte";

	const helpers = getContext("wx-helpers");
	const { data } = getData();

	const columns = [
		{
			id: "id",
			width: 50,
			header: [{ cell: HeaderTextCell, colspan: 3 }],
			footer: [
				{
					cell: FooterTextCell,
					colspan: 3,
					text: "Custom footer content",
				},
			],
		},
		{
			id: "checked",
			cell: CheckboxCell,
			width: 36,
		},
		{ id: "avatar", cell: AvatarCell, width: 350 },
	];

	function action(action, ev) {
		const { value, row, column } = ev;
		const event = `event: ${action}\n`;
		const val = `value: ${value}\n`;
		const r = `row ID: ${row}\n`;
		const c = `col ID: ${column}\n`;

		helpers.showNotice({
			text: event + val + r + c,
		});
	}
</script>

<div class="demo" style="padding: 20px;">
	<h4>Table with custom cells and templates</h4>
	<div style="height: 320px; max-width: 800px;">
		<Grid
			sizes={{ rowHeight: 70 }}
			{data}
			{columns}
			footer
			cellStyle={(row, col) => {
				let css = "";
				if (col.id == "id") css = "vcenter";
				else if (col.id == "checked") css = "vcentercontrol";
				return css;
			}}
			oncustomcheck={ev => action("checkbox", ev)}
		/>
	</div>
</div>

<style>
	.demo :global(.vcenter) {
		line-height: 50px;
	}

	.demo :global(.vcentercontrol) {
		padding-top: 25px !important;
	}
</style>
