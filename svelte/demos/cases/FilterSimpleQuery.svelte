<script>
	import { getOptions } from "wx-query-store";
	import { Query, createArrayFilter } from "wx-svelte-query";
	import { getData } from "../data";
	import { Grid } from "../../src/";

	const { data, columns } = getData();

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

	let filteredData = data;
	function applyFilter(value) {
		filteredData = createArrayFilter(value)(data);
	}
</script>

<div style="padding: 20px;">
	<div>
		<div class="query">
			<Query
				type={"simple"}
				{fields}
				{options}
				on:change={ev => applyFilter(ev.detail.value)}
			/>
		</div>
		<Grid data={filteredData} {columns} />
	</div>
</div>

<style>
	.query {
		margin-bottom: 20px;
	}
</style>
