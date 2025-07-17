<script>
	import { FilterBuilder, createFilter, getOptions } from "wx-svelte-filter";

	import { getData } from "../data";
	import { Grid } from "../../src";

	const { data, columns } = getData();
	columns.push({ id: "comments", flexgrow: 1, header: "Comments" });

	let api = $state();

	let options = {
		city: getOptions(data, "city"),
		firstName: getOptions(data, "firstName"),
		lastName: getOptions(data, "lastName"),
		email: getOptions(data, "email"),
	};

	let fields = [
		{ id: "city", label: "City", type: "text" },
		{ id: "firstName", label: "Name", type: "text" },
		{ id: "lastName", label: "Last Name", type: "text" },
		{ id: "email", label: "Email", type: "text" },
	];

	function applyFilter({ value }) {
		const filter = createFilter(value);
		api.exec("filter-rows", { filter });
	}
</script>

<div style="padding: 20px;">
	<h4>Filter grid data executing "filter-rows" action</h4>
	<FilterBuilder {fields} {options} type={"line"} onchange={applyFilter} />

	<Grid {data} {columns} bind:this={api} />
</div>
