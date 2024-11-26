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

	let api = $state(),
		s = $state(0);
	const updateSelected = () => (s = api.getState().selected);
</script>

<div style="padding: 20px;">
	<h4>Click on any cell to select. Selected: {s || "none"}</h4>
	<div>
		<Grid {data} {columns} bind:this={api} onselectrow={updateSelected} />
	</div>
</div>
