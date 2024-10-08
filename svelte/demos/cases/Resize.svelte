<script>
	import { Grid } from "../../src";

	import { getData } from "../data";
	const { data } = getData();

	const columns = [
		{ id: "id", width: 50, resize: true },
		{ id: "city", header: "City", flexgrow: 1, resize: true },
		{ id: "email", header: "Email", flexgrow: 2, resize: true },
		{ id: "firstName", header: "First Name", resize: true },
		{ id: "lastName", header: "Last Name", resize: true },
	];
</script>

<div style="padding: 20px;">
	<h4>Resizable columns: drag a border between header cells</h4>
	<div style="max-width: 700px;">
		<Grid {data} {columns} splitLeft="2" />
	</div>
</div>
