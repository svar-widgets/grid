<script lang="ts">
	import {
		FilterBuilder,
		createArrayFilter,
		getOptions,
		type IField,
		type IFilterSet,
	} from "@svar-ui/svelte-filter";
	import { getData } from "../data";
	import { Grid, type IRow } from "@svar-ui/svelte-grid";

	const { data, columns } = getData();

	let options = {
		city: getOptions(data, "city"),
		firstName: getOptions(data, "firstName"),
		lastName: getOptions(data, "lastName"),
		email: getOptions(data, "email"),
	};

	let fields: IField[] = [
		{ id: "city", label: "City", type: "text" },
		{ id: "firstName", label: "First Name", type: "text" },
		{ id: "lastName", label: "Last Name", type: "text" },
		{ id: "email", label: "Email", type: "text" },
	];

	const value: IFilterSet = {
		rules: [
			{
				field: "firstName",
				filter: "contains",
				value: "C",
			},
		],
	};

	let filteredData = $state<IRow[]>([]);
	applyFilter(value);

	function applyFilter(value: IFilterSet) {
		filteredData = createArrayFilter(value)(data);
	}
</script>

<div style="padding: 20px;">
	<h4>Filter data before parsing to Grid</h4>
	<FilterBuilder
		{value}
		type={"simple"}
		{fields}
		{options}
		onchange={ev => applyFilter(ev.value)}
	/>
	<Grid data={filteredData} {columns} />
</div>
