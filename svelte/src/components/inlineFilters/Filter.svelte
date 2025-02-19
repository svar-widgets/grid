<script>
	import { getContext } from "svelte";
	import { filters } from "./filters";

	let { filter, column } = $props();

	const api = getContext("grid-store");
	const { filterValues } = api.getReactiveState();

	function filterRows(data) {
		api.exec("filter-rows", data);
	}

	const SvelteComponent = $derived(filters[filter.type]);
</script>

<SvelteComponent
	{filter}
	{column}
	action={filterRows}
	filterValue={$filterValues[column.id]}
/>
