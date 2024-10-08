<script>
	import { Grid } from "../../src";
	import { getData } from "../data";
	const { data } = getData();

	let columns = [
		{ id: "id", width: 50, sort: true },
		{ id: "city", header: "City", width: 160, sort: true },
		{ id: "email", header: "Email", width: 250, sort: true },
		{ id: "firstName", header: "First Name", sort: true },
		{ id: "lastName", header: "Last Name", sort: true },
	];
</script>

<div style="padding: 20px;">
	<h4>Click on header cells to sort the data</h4>
	<Grid {data} {columns} />
</div>
