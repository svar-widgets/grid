<script>
	import { Grid } from "../../src";

	import { getData } from "../data";
	const { data } = getData();

	const columns = [
		{ id: "id", width: 50 },
		{ id: "city", header: "City", width: 160 },
		{ id: "firstName", header: "First Name", flexgrow: 1 },
		{ id: "lastName", header: "Last Name", flexgrow: 1 },
		{ id: "companyName", header: "Company", flexgrow: 2 },
	];
</script>

<div style="padding: 20px;">
	<h4>Columns with flexible widths to fill the available space</h4>
	<div>
		<Grid {data} {columns} />
	</div>
</div>
