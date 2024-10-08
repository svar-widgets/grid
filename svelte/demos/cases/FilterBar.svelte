<script>
	import { Tabs } from "wx-svelte-core";
	import { FilterBar, createArrayFilter, getOptions } from "wx-svelte-query";

	import { Grid } from "../../src";
	import { getData } from "../data";
	const { data, columns } = getData();

	let filteredData = data;

	let fields;
	let cols;
	let api;
	$: {
		if (api) {
			fields = [];
			cols = api.getReactiveState().columns;
			$cols.forEach(col => {
				if (col.id !== "id") {
					fields.push(col.id);
				}
			});
		}
	}

	function applyFilter(value) {
		const filter = createArrayFilter(value);
		filteredData = filter(data);
	}

	let filter = 1;
	let filterTabs1 = [
		{ id: 1, label: "By all" },
		{ id: 2, label: "By city" },
		{ id: 3, label: "By the field" },
	];

	$: {
		if (filter) applyFilter();
	}

	const cities = getOptions(data, "city");
</script>

<div style="padding: 20px;">
	<Tabs bind:value={filter} options={filterTabs1} />

	{#if filter === 1 && fields}
		<FilterBar {fields} on:change={ev => applyFilter(ev.detail.value)} />
	{:else if filter === 2}
		<FilterBar
			by={{ type: "select", field: "city", options: cities }}
			on:change={ev => applyFilter(ev.detail.value)}
		/>
	{:else if filter === 3}
		<FilterBar
			by=":dynamic"
			fields={["city", "firstName", "lastName", "email"]}
			on:change={ev => applyFilter(ev.detail.value)}
		/>
	{/if}

	<Grid data={filteredData} {columns} bind:api />
</div>
