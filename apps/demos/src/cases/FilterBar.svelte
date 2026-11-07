<script lang="ts">
	import { Tabs } from "@svar-ui/svelte-core";
	import {
		FilterBar,
		createFilter,
		getOptions,
		type IFilterSet,
	} from "@svar-ui/svelte-filter";

	import { Grid, type IApi } from "@svar-ui/svelte-grid";
	import { getData } from "../data";
	const { data, columns } = getData();

	let api = $state<IApi>();

	let filterId = $state(1);
	const filterTabs = [
		{ id: 1, label: "By all" },
		{ id: 2, label: "By city" },
		{ id: 3, label: "By the field" },
	];

	const cities = getOptions(data, "city");

	function handleValueChange({ value }: { value: IFilterSet }) {
		const filter = createFilter(value);
		api!.exec("filter-rows", { filter });
	}

	function handleFilterChange({ value }: { value: string | number }) {
		filterId = value as number;
		api!.exec("filter-rows", { filter: null });
	}
</script>

<div style="padding: 20px;">
	<h4>Filter grid data executing "filter-rows" action</h4>

	<Tabs value={filterId} options={filterTabs} onchange={handleFilterChange} />

	{#if filterId === 1}
		<FilterBar
			fields={[
				{
					type: "all",
					by: ["id", "city", "firstName", "lastName", "email"],
				},
			]}
			onchange={handleValueChange}
		/>
	{:else if filterId === 2}
		<FilterBar
			fields={[
				{
					type: "text",
					id: "city",
					options: cities,
				},
			]}
			onchange={handleValueChange}
		/>
	{:else if filterId === 3}
		<FilterBar
			fields={[
				{
					type: "dynamic",
					by: ["city", "firstName", "lastName", "email"],
				},
			]}
			onchange={handleValueChange}
		/>
	{/if}

	<Grid {data} {columns} bind:this={api} />
</div>
