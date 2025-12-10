<script>
	import { Text, Field, CheckboxGroup, Button } from "@svar-ui/svelte-core";
	import { getData } from "../data";
	import { Grid } from "../../src";

	const { allData: data, countries } = getData();

	const columns = [
		{ id: "id", header: "Id", width: 50 },
		{ id: "firstName", header: "First Name", width: 150 },
		{ id: "lastName", header: "Last Name", width: 150 },
		{ id: "email", header: "Email" },
		{ id: "country", header: "Country", options: countries },
		{ id: "companyName", header: "Company" },
	];

	const options = columns.map(col => ({ id: col.id, label: col.header }));

	let api = $state();
	let searchValue = $state("");
	let searchColumns = $state([]);
	let search = $state();
	let flatData = $state();
	let currentSearchIndex = $state(-1);
	let currentRowId = $state(null);

	let searchRows = $derived(Object.keys($search.rows));

	function searchByText({ value }) {
		searchValue = value;
		doSearch();
	}

	function searchByColumns({ value }) {
		searchColumns = value;
		doSearch();
	}

	function doSearch() {
		const searchParams = { search: searchValue };

		if (searchColumns.length) {
			const columns = {};
			searchColumns.forEach(col => (columns[col] = true));
			searchParams.columns = columns;
		}

		api.exec("search-rows", searchParams);
		currentSearchIndex = -1;
		sortedRows = currentRowId = null;
	}

	function init(obj) {
		api = obj;
		const rState = api.getReactiveState();
		search = rState.search;
		flatData = rState.flatData;
	}

	function showPrev() {
		currentSearchIndex -= 1;
		navigateToRow();
	}

	function showNext() {
		currentSearchIndex += 1;
		navigateToRow();
	}

	let sortedRows = $state(null);

	function navigateToRow() {
		if (!sortedRows)
			sortedRows = $flatData
				.filter(r => searchRows.includes(r.id + ""))
				.map(r => r.id);
		currentRowId = sortedRows[currentSearchIndex];
		// scroll to the current search result row
		api.exec("scroll", { row: currentRowId });
	}
</script>

<div class="demo" style="padding: 20px;">
	<h4>Search Rows in DataGrid</h4>

	<div style="margin-bottom: 20px;">
		<div class="search">
			<div style="width: 400px">
				<Text
					value={searchValue}
					placeholder="Enter search value..."
					icon="wxi-search"
					clear
					onchange={searchByText}
				/>
			</div>

			{#if $search?.value?.trim()}
				<div class="navigation">
					<Button
						text="Previous"
						onclick={showPrev}
						disabled={currentSearchIndex === -1}
					/>
					<Button
						text="Next"
						onclick={showNext}
						disabled={currentSearchIndex === searchRows.length - 1}
					/>
					<span
						>{currentSearchIndex + 1}/{searchRows.length} (rows matches)</span
					>
				</div>
			{/if}
		</div>

		<Field label="Columns:" position="left" type="checkbox">
			<CheckboxGroup
				{options}
				value={searchColumns}
				type="inline"
				onchange={searchByColumns}
			/>
		</Field>
	</div>

	<div style="height: 400px;">
		<Grid
			{data}
			{columns}
			{init}
			rowStyle={row => (currentRowId == row.id ? "search-highlight" : "")}
		/>
	</div>
</div>

<style>
	.demo :global(.wx-checkboxgroup) {
		flex-wrap: nowrap;
	}
	.demo :global(.wx-field) {
		--wx-label-width: 65px;
	}
	.search {
		margin-bottom: 12px;
		gap: 20px;
	}
	.search,
	.navigation {
		display: flex;
		align-items: center;
	}
	.navigation {
		gap: 8px;
	}

	.demo :global(.search-highlight) {
		background-color: #fffacf;
	}
	:global(.wx-willow-dark-theme .demo .search-highlight) {
		background-color: #a0995b;
	}
</style>
