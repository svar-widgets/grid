<script>
	import { getData } from "../data";
	import { Grid } from "../../src/";
	import { Material, Locale } from "wx-svelte-core";

	const { data } = getData();

	const columns = [
		{ id: "id", width: 50 },
		{
			id: "firstName",
			header: [{ text: "User", colspan: 2 }, { text: "First Name" }],
			footer: [
				{ text: "First Name", rowspan: 2 },
				{ text: "User", colspan: 2 },
			],
			width: 150,
			resize: true,
		},
		{
			id: "lastName",
			header: ["", "Last Name"],
			footer: [{ text: "Last Name", rowspan: 2 }, ""],
			width: 150,
		},
		{
			id: "email",
			header: [
				{ text: "Email", rowspan: 2, css: "center" },
				"Second line",
			],
			footer: [
				"Second line",
				{ text: "Email", rowspan: 2, css: "center" },
			],
		},
		{
			id: "companyName",
			header: [
				{ text: "Company", colspan: 2, css: "center" },
				{ text: "Name" },
			],
			footer: [
				{ text: "Name", rowspan: 2 },
				{ text: "Company", colspan: 2, css: "center" },
			],
			// flexgrow: 1
		},
		{
			id: "city",
			width: 100,
			// flexgrow: 1,
			header: ["", "City"],
			footer: [{ text: "City", rowspan: 2 }, ""],
		},
		{ id: "stars", header: "Stars", footer: "Stars" },
		{
			id: "date",
			header: ["Some", "Header", "Lines"],
			footer: ["Lines", "Footer", "Some"],
		},
	];
</script>

<Material>
	<Locale>
		<div class="demo" style="padding: 20px;">
			<div>
				<Grid {data} {columns} footer={true} />
			</div>
		</div>
	</Locale>
</Material>

<style>
	.demo {
		--wx-table-header-cell-border: var(--wx-table-cell-border);
		--wx-table-footer-cell-border: var(--wx-table-cell-border);
	}

	.demo :global(.center) {
		justify-content: center;
	}

	.demo :global(.wx-footer) {
		border-bottom: none;
	}
</style>
