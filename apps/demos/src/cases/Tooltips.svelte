<script lang="ts">
	import { getData } from "../data";
	import { Grid, Tooltip, type IApi, type IRow } from "@svar-ui/svelte-grid";
	import CustomTooltip from "../custom/CustomTooltip.svelte";

	const { data, columns } = getData();

	const columnsTooltip = [
		{ id: "id", width: 50, tooltip: false },
		{
			id: "city",
			width: 100,
			header: "City",
			footer: "City",
		},
		{
			id: "firstName",
			header: "First Name",
			footer: "First Name",
			width: 150,
			tooltip: false,
		},
		{
			id: "lastName",
			header: "Last Name",
			footer: "Last Name",
			width: 150,
			tooltip: false,
		},
		{ id: "email", header: "Email", footer: "Email" },
		{ id: "companyName", header: "Company", footer: "Company" },
		{ id: "stars", tooltip: false },
		{ id: "date", tooltip: (obj: IRow) => obj.date?.toDateString() },
	];

	let api = $state<IApi>();
	let api1 = $state<IApi>();
</script>

<div style="padding: 20px;">
	<h4>Default text tooltips for specific columns</h4>
	<p>The tooltip is only shown for cells with overflow</p>
	<div>
		<Tooltip overflow {api}>
			<Grid {data} columns={columnsTooltip} bind:this={api} />
		</Tooltip>
	</div>

	<h4>Custom tooltips</h4>
	<div>
		<Tooltip content={CustomTooltip} api={api1}>
			<Grid {data} {columns} bind:this={api1} />
		</Tooltip>
	</div>
</div>
