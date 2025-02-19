<script>
	import { Field, DateRangePicker, Text } from "wx-svelte-core";
	import { Grid } from "../../src";
	import { getData } from "../data";

	const { allData } = getData();

	const columns = [
		{ id: "id", width: 50 },
		{
			id: "firstName",
			header: "First Name",
			footer: "First Name",
		},
		{
			id: "lastName",
			header: "Last Name",
			footer: "Last Name",
		},
		{
			id: "date",
			header: "Date",
			template: v => v.toDateString(),
			width: 160,
		},
		{
			id: "companyName",
			header: "Company",
			flexgrow: 1,
		},
	];

	let tableApi = $state();
	let dateValue = $state();
	let companyValue = $state("");

	function init(api) {
		tableApi = api;
	}

	function handleFilter() {
		const filterValues = {
			date: dateValue,
			companyName: companyValue,
		};

		const filter = createFilter(filterValues);
		tableApi.exec("filter-rows", { filter });
	}

	function createFilter(filterValues) {
		const filters = Object.keys(filterValues)
			.filter(key => filterValues[key])
			.map(key => {
				const value = filterValues[key];

				switch (key) {
					case "companyName": {
						return v => {
							if (v[key])
								return (
									v[key]
										.toLowerCase()
										.indexOf(value.toLowerCase()) !== -1
								);
						};
					}
					case "date": {
						return v => {
							if (v[key]) return isDateInRange(v[key], value);
						};
					}
				}
			});

		return obj => {
			for (let i = 0; i < filters.length; i++) {
				if (!filters[i](obj)) {
					return false;
				}
			}
			return true;
		};
	}

	function isDateInRange(date, range) {
		const { start, end } = range;
		const nDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate()
		);

		return nDate >= start && nDate <= end;
	}
</script>

<div class="demo" style="padding: 20px;">
	<h4>Grid with external filters</h4>
	<div style="max-width:810px">
		<div class="controls">
			<Field label={'Filter "Date" column'}>
				{#snippet children({ id })}
					<DateRangePicker
						bind:value={dateValue}
						{id}
						clear
						onchange={handleFilter}
					/>
				{/snippet}
			</Field>
			<Field label={'Filter "Company" column'}>
				{#snippet children({ id })}
					<Text
						bind:value={companyValue}
						{id}
						clear
						icon={"wxi-search"}
						onchange={handleFilter}
					/>
				{/snippet}
			</Field>
		</div>
		<div style="height: 400px;">
			<Grid data={allData} {columns} {init} />
		</div>
	</div>
</div>

<style>
	.controls {
		display: flex;
		gap: 10px;
	}
</style>
