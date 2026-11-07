<script lang="ts">
	import { Field, DateRangePicker, Text } from "@svar-ui/svelte-core";
	import {
		Grid,
		type IColumnConfig,
		type IApi,
		type IRow,
	} from "@svar-ui/svelte-grid";
	import { getData } from "../data";

	const { allData } = getData();

	const columns: IColumnConfig[] = [
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

	let tableApi = $state<IApi>();
	let dateValue = $state<{ start: Date; end?: Date }>();
	let companyValue = $state("");

	function init(api: IApi) {
		tableApi = api;
	}

	function handleFilter() {
		const filterValues = {
			date: dateValue,
			companyName: companyValue,
		};

		const filter = createFilter(filterValues);
		tableApi!.exec("filter-rows", { filter });
	}

	type TFilterValues = Record<string, any>;

	function createFilter(filterValues: TFilterValues) {
		const filters = Object.keys(filterValues)
			.filter(key => filterValues[key])
			.map(key => {
				const value = filterValues[key];

				switch (key) {
					case "companyName": {
						return (v: IRow) => {
							if (v[key])
								return (
									v[key]
										.toLowerCase()
										.indexOf(value.toLowerCase()) !== -1
								);
						};
					}
					case "date": {
						return (v: IRow) => {
							if (v[key]) return isDateInRange(v[key], value);
						};
					}
				}
			});

		return (obj: IRow) => {
			for (let i = 0; i < filters.length; i++) {
				if (!filters[i]!(obj)) {
					return false;
				}
			}
			return true;
		};
	}

	function isDateInRange(date: Date, range: { start: Date; end: Date }) {
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
				<DateRangePicker
					bind:value={dateValue}
					clear
					onchange={handleFilter}
				/>
			</Field>
			<Field label={'Filter "Company" column'}>
				<Text
					bind:value={companyValue}
					clear
					icon={"wxi-search"}
					onchange={handleFilter}
				/>
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
