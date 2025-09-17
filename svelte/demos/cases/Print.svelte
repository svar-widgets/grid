<script>
	import { Grid } from "../../src";
	import { Button } from "@svar-ui/svelte-core";
	import { getData, repeatData } from "../data";

	const { treeData, treeColumns } = getData();
	const data = repeatData(100);

	const columns = [
		{
			id: "id",
			width: 50,
			footer: { text: "All users", colspan: 7 },
			sort: true,
		},
		{
			id: "firstName",
			header: [
				{
					text: "Main client info",
					colspan: 5,
					collapsible: true,
				},
				{ text: "User", colspan: 2, collapsible: true },
				{ text: "First Name" },
			],
			width: 150,
			sort: true,
		},
		{
			id: "lastName",
			header: ["", "", "Last Name"],
			width: 150,
		},
		{
			id: "email",
			header: [
				"",
				{
					text: "Email",
					rowspan: 2,
					vertical: true,
				},
				"",
			],
		},
		{
			id: "companyName",
			header: [
				"",
				{
					text: "Company",
					colspan: 2,
					collapsible: true,
					collapsed: true,
				},
				{ text: "Name" },
			],
		},
		{
			id: "city",
			width: 100,
			header: ["", "", "City"],
		},
		{
			id: "stars",
			header: { text: "Stars points", vertical: true },
			width: 50,
		},
		{
			id: "date",
			template: obj => obj.toDateString(),
			header: "Joined",
			footer: { text: data.length, css: "right" },
		},
	];

	let api1 = $state();
	let api2 = $state();

	function printGrid(api) {
		api.exec("print");
	}
</script>

<div class="demo" style="padding: 20px;">
	<h4>Print grid</h4>
	<div>
		<Button onclick={() => printGrid(api1)} type={"primary"}
			>Print Grid</Button
		>
	</div>
	<div style="height: 400px; margin-top: 10px;">
		<Grid
			bind:this={api1}
			{data}
			{columns}
			rowStyle={row => (row.id == 3 ? "rowStyle" : "")}
			footer={true}
		/>
	</div>
	<h4>Print tree structured grid</h4>
	<div>
		<Button onclick={() => printGrid(api2)} type={"primary"}
			>Print Grid</Button
		>
	</div>
	<div style="height: 400px; margin-top: 10px;">
		<Grid
			bind:this={api2}
			tree={true}
			data={treeData}
			columns={treeColumns}
			footer={true}
		/>
	</div>
</div>

<style>
	:global(.rowStyle:not(.wx-selected) .wx-cell:not(.cellStyle)) {
		color: white;
		background: #457b9d;
	}
</style>
