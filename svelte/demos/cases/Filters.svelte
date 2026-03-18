<script>
	import { Button } from "@svar-ui/svelte-core";
	import { getData } from "../data";
	import { Grid } from "../../src";

	const { allData, data, countries, users } = getData();

	const dateFormat = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});

	const columns = [
		{ id: "id", width: 50 },
		{
			id: "firstName",
			header: { filter: "text" },
			footer: "First Name",
			width: 150,
		},
		{
			id: "lastName",
			header: { filter: { type: "text" } },
			footer: "Last Name",
			width: 150,
		},
		{
			id: "email",
			header: "Email",
			footer: "Email",
		},
		{
			id: "country",
			header: {
				filter: {
					type: "richselect",
					config: {
						options: countries,
					},
				},
			},
			options: countries,
		},
		{
			id: "date",
			header: { filter: "datepicker" },
			template: obj => dateFormat.format(obj),
			width: 180,
		},
		{
			id: "stars",
			header: { filter: "text" },
			footer: "Stars",
		},
	];
	const columnsSpans = [
		{
			id: "id",
			width: 50,
			footer: { text: "All users", colspan: 7 },
		},
		{
			id: "firstName",
			header: [
				{
					text: "Main client info",
					colspan: 3,
					collapsible: true,
					open: true,
				},
				{ text: "First Name" },
				{ filter: "text" },
			],
			width: 150,
		},
		{
			id: "lastName",
			header: ["", "Last Name", { filter: "text" }],
			width: 150,
		},
		{
			id: "email",
			header: [
				"",
				{
					collapsible: true,
					text: "Email",
				},
				{ filter: "text" },
			],
		},
		{
			id: "companyName",
			header: [
				{
					text: "Company",
					colspan: 2,
					collapsible: true,
				},
				{ text: "Name", rowspan: 2 },
				"",
			],
		},
		{
			id: "country",
			options: countries,
			header: [
				"",
				"Country",
				{
					filter: {
						type: "richselect",
					},
				},
			],
		},
		{
			id: "date",
			width: 180,
			template: obj => dateFormat.format(obj),
			header: [{ text: "Joined", rowspan: 2 }, { filter: "datepicker" }],
		},
		{
			id: "user",
			header: [
				{ text: "Assigned", rowspan: 2 },
				{
					filter: {
						type: "richselect",
					},
				},
			],
			footer: { text: data.length, css: "right" },
			width: 180,
			options: users,
		},
	];

	columns.forEach(c => {
		c.sort = true;
		c.resize = true;
	});

	columnsSpans.forEach(c => {
		c.sort = true;
		c.resize = true;
	});

	let grid1 = $state(),
		grid2 = $state();

	function clear(grid) {
		grid.exec("filter-rows", {});
	}
</script>

<div class="demo" style="padding: 20px;">
	<h4>Grids with header filters</h4>
	<Button type="primary" onclick={() => clear(grid1)}>Clear filters</Button>
	<div style="height: 400px;margin: 10px 0 20px;">
		<Grid data={allData} {columns} bind:this={grid1} />
	</div>

	<Button type="primary" onclick={() => clear(grid2)}>Clear filters</Button>
	<div style="height: 600px;margin-top:10px">
		<Grid
			data={allData}
			columns={columnsSpans}
			footer={true}
			bind:this={grid2}
		/>
	</div>
</div>

<style>
	.demo :global(.center) {
		justify-content: center;
	}

	.demo :global(.right) {
		justify-content: right;
	}
</style>
