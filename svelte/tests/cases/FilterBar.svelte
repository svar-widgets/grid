<script>
	import { Material, Locale, Tabs } from "wx-svelte-core";
	import { FilterBar, createArrayFilter } from "wx-svelte-query";

	import { Grid } from "../../src";
	import { getData } from "../data";
	const { data, columns } = getData();

	let fields = $state();
	let cols = $state();
	let api = $state();

	function init(api) {
		fields = [];
		cols = api.getReactiveState().columns;
		$cols.forEach(col => {
			if (col.id !== "id") {
				fields.push(col.id);
			}
		});
	}

	const filteredData = $derived(createArrayFilter(value)(data));

	let value = $state();
	let filter = $state(1);
	let filterTabs1 = [
		{ id: 1, label: "By all" },
		{ id: 2, label: "By city" },
		{ id: 3, label: "By the field" },
	];
</script>

<Material>
	<Locale>
		<div style="padding: 20px;">
			<Tabs bind:value={filter} options={filterTabs1} />

			{#if filter === 1 && fields}
				<FilterBar {fields} onchange={ev => (value = ev.value)} />
			{:else if filter === 2}
				<FilterBar by={"city"} onchange={ev => (value = ev.value)} />
			{:else if filter === 3}
				<FilterBar
					by=":dynamic"
					fields={["city", "firstName", "lastName", "email"]}
					onchange={ev => (value = ev.value)}
				/>
			{/if}

			<Grid data={filteredData} {columns} bind:this={api} {init} />
		</div>
	</Locale>
</Material>
