<script>
	import { getOptions } from "wx-query-store";
	import { Query, createFilter } from "/svelte-query";

	import { getData } from "../data";
	import { Grid } from "../../src/";

	const { data, columns } = getData();
	columns.push({ id: "comments", flexgrow: 1, header: "Comments" });

	let options = {
		city: getOptions(data, "city"),
		firstName: getOptions(data, "firstName"),
		lastName: getOptions(data, "lastName"),
		email: getOptions(data, "email"),
	};

	let fields = [
		{ id: "city", name: "City" },
		{ id: "firstName", name: "Name" },
		{ id: "lastName", name: "Last Name" },
		{ id: "email", name: "Email" },
	];

	let filter = $state();
	function applyFilter(value) {
		filter = createFilter(value);
	}
</script>

<div style="padding: 20px;">
	<div>
		<Query
			{fields}
			{options}
			type={"line"}
			onchange={ev => applyFilter(ev.value)}
		/>

		<Grid {data} {columns} {filter} />
	</div>
</div>
