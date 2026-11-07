<script lang="ts">
	import { getData } from "../data";
	import {
		Grid,
		type IColumnConfig,
		type IApi,
		type IRow,
	} from "@svar-ui/svelte-grid";

	const { allData } = getData();

	const columns: IColumnConfig[] = [
		{ id: "id", width: 50 },
		{
			id: "city",
			width: 100,
			header: { text: "City", rowspan: 2 },
			footer: "City",
		},
		{
			id: "firstName",
			header: ["First Name", { filter: "text" }],
			footer: "First Name",
		},
		{
			id: "lastName",
			header: ["Last Name", { filter: "text" }],
			footer: "Last Name",
		},
		{
			id: "email",
			header: { text: "Email", rowspan: 2 },
			footer: "Email",
			width: 230,
		},
	];

	function init(api: IApi) {
		api.intercept("filter-rows", ev => {
			const { filterValues } = api.getState();
			const { value, key } = ev;

			filterValues![key!] = value;
			ev.filter = createFilter(filterValues!);
		});
	}

	function createFilter(filterValues: Record<string, any>) {
		const filters = Object.keys(filterValues)
			.filter(key => filterValues[key])
			.map(key => {
				const value = filterValues[key];
				return (v: IRow) => {
					if (v[key])
						return (
							v[key]
								.toLowerCase()
								.indexOf(value.toLowerCase()) !== -1
						);
				};
			});

		return (obj: IRow) => {
			if (!filters.length) return true;
			for (let i = 0; i < filters.length; i++) {
				if (filters[i](obj)) {
					return true;
				}
			}
			return false;
		};
	}
</script>

<div class="demo" style="padding: 20px;">
	<h4>Grid with header filters and custom filter handler</h4>
	<p>Filter by "First Name" or "Last Name"</p>
	<div style="height: 400px;">
		<Grid data={allData} {columns} {init} />
	</div>
</div>
