<script>
	import { getData } from "../../data";
	import { Grid } from "../../../src";
	import { Material, Locale } from "wx-svelte-core";

	const { data } = $state(getData());
	data.length = 5;

	const columns = [
		{ id: "id", width: 50 },
		{
			id: "firstName",
			header: [
				{ text: "Main client info", colspan: 5 },
				{ text: "User", colspan: 2 },
				{ text: "First Name", vertical: true },
			],
			footer: [
				{ text: "Main client info", colspan: 3 },
				{ text: "User", colspan: 2 },
				{ text: "First Name", vertical: true },
			],
			width: 150,
		},
		{
			id: "lastName",
			header: ["", "", { text: "Last Name", vertical: true }],
			footer: ["", "", { text: "Last Name", vertical: true }],
			width: 150,
		},
		{
			id: "email",
			header: [
				"",
				{ text: "Email with long text", vertical: true, rowspan: 2 },
			],
			footer: [
				"",
				{ text: "Email with long text", vertical: true, rowspan: 2 },
			],
		},
		{
			id: "companyName",
			header: ["", { text: "Company", colspan: 2 }, { text: "Name" }],
			footer: [
				{
					text: "Company long text",
					colspan: 2,
					rowspan: 2,
					vertical: true,
				},
				{ text: "Name" },
			],
		},
		{
			id: "city",
			width: 100,
			header: ["", "", "City"],
			footer: ["", "City"],
		},
		{
			id: "stars",
			header: { text: "Stars with long long text", vertical: true },
			footer: { text: "Stars with long long text", vertical: true },
			width: 50,
		},
		{
			id: "date",
			template: obj => obj.toDateString(),
			header: "Joined",
			footer: "Joined",
		},
	];

	let api = $state();
</script>

<Material>
	<Locale>
		<div class="demo" style="padding: 20px;">
			<div style="margin-top: 20px;">
				<Grid {data} {columns} footer={true} bind:this={api} />
			</div>
		</div>
	</Locale>
</Material>

<style>
	.demo {
		--wx-table-header-cell-border: var(--wx-table-cell-border);
		--wx-table-footer-cell-border: var(--wx-table-cell-border);
	}

	.demo :global(.wx-footer) {
		border-bottom: none;
	}
</style>
