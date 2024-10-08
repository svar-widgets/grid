<script>
	import { Grid } from "../../src";

	import { getData } from "../data";
	const { data } = getData();

	const columns = [
		{ id: "id", width: 50 },
		{ id: "city", header: "City", width: 160 },
		{ id: "firstName", header: "First Name" },
		{ id: "lastName", header: "Last Name" },
		{ id: "companyName", header: "Company" },
	];

	let api,
		s = [];
	const updateSelected = () => (s = api.getState().selectedRows);
</script>

<div style="padding: 20px;">
	<h4>
		Click cells using Ctrl/Shift keys. Selected:
		{s.length ? s.join(", ") : "none"}
	</h4>
	<div>
		<Grid
			{data}
			{columns}
			multiselect={true}
			bind:api
			on:select-row={updateSelected}
		/>
	</div>
</div>
