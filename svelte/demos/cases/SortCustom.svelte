<script>
	import { Grid } from "../../src";
	import { getData } from "../data";
	import { Button } from "@svar-ui/svelte-core";

	const { data } = getData();
	let api = $state();

	const columnsCustomSort = [
		{ id: "id", width: 50, sort: true },
		{ id: "city", header: "City", width: 160, sort: true },
		{
			id: "street",
			header: "Street",
			width: 200,
			sort: (a, b) => {
				return a.zipCode.localeCompare(b.zipCode);
			},
			template: (value, row) => `${row.street}, ${row.zipCode}`,
		},
		{ id: "firstName", header: "First Name", sort: true },
		{ id: "lastName", header: "Last Name", sort: true },
	];

	const columnsSort = [
		{ id: "id", width: 50, sort: false },
		{ id: "city", header: "City", width: 160, sort: true },
		{ id: "firstName", header: "First Name", sort: true },
		{ id: "lastName", header: "Last Name", sort: true },
	];
	let sortMarks = $state();
	function onclick() {
		sortMarks = {
			lastName: {
				order: sortMarks?.lastName?.order === "asc" ? "desc" : "asc",
			},
		};

		api.exec("sort-rows", {
			sort: (a, b) => {
				return sortMarks?.lastName?.order === "asc"
					? a.lastName.localeCompare(b.lastName)
					: -a.lastName.localeCompare(b.lastName);
			},
		});
	}
</script>

<div class="demo-container">
	<div>
		<h4>Custom sorting function can be specified in columns config</h4>
		<Grid {data} columns={columnsCustomSort} />
	</div>
	<div>
		<h4>Sorting via sort-rows action call</h4>
		<Button {onclick} css="demo-button-sort" type="primary">
			Click to sort by last name
		</Button>

		<Grid {data} bind:this={api} {sortMarks} columns={columnsSort} />
	</div>
</div>

<style>
	.demo-container {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 20px;
	}
	:global(.demo-button-sort) {
		margin-bottom: 16px;
	}
</style>
