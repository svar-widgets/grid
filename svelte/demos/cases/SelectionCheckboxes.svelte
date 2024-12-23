<script>
	import { Grid } from "../../src";
	import SelectionCheckboxCell from "../custom/SelectionCheckboxCell.svelte";
	import SelectionCheckboxBind from "../custom/SelectionCheckboxBind.svelte";

	import { getData } from "../data";
	const { data } = getData();

	const columns = [
		{ id: "selected", cell: SelectionCheckboxCell, width: 36 },
		{ id: "city", header: "City", width: 160 },
		{ id: "firstName", header: "First Name" },
		{ id: "lastName", header: "Last Name" },
		{ id: "companyName", header: "Company" },
	];

	const columnsBind = [
		{ id: "selected", cell: SelectionCheckboxBind, width: 36 },
		{ id: "city", header: "City", width: 160 },
		{ id: "firstName", header: "First Name" },
		{ id: "lastName", header: "Last Name" },
		{ id: "companyName", header: "Company" },
	];
</script>

<div class="demo" style="padding: 20px;">
	<h4>Select only by checkboxes</h4>
	<div>
		<Grid {data} {columns} select={false} />
	</div>
</div>

<div class="demo" style="padding: 20px;">
	<h4>Select by checkboxes and clicking</h4>
	<div>
		<Grid
			{data}
			columns={columnsBind}
			multiselect={true}
			selectedRows={[13]}
		/>
	</div>
</div>

<style>
	.demo {
		--wx-checkbox-border-width: 1px;
	}
</style>
