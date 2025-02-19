<script>
	import { getData } from "../data";
	import { Grid } from "../../src";
	import StatusCell from "../custom/StatusCell.svelte";

	const { allData, countries } = getData();

	const columns = [
		{ id: "id", width: 50 },
		{
			id: "firstName",
			header: [
				"First Name",
				{
					filter: {
						type: "text",
						config: {
							icon: "wxi-search",
							clear: true,
						},
					},
				},
			],
			footer: "First Name",
		},
		{
			id: "lastName",
			header: [
				"Last Name",
				{
					filter: {
						type: "text",
						config: {
							icon: "wxi-search",
							clear: true,
						},
					},
				},
			],
			footer: "Last Name",
		},
		{
			id: "country",
			header: [
				"Country",
				{
					filter: {
						type: "richselect",
						config: {
							options: countries,
							template: opt => `${opt.id}. ${opt.label}`,
						},
					},
				},
			],
			options: countries,
		},
		{
			id: "checked",
			header: [
				"Active",
				{
					filter: {
						type: "richselect",
						config: {
							template: opt => `● ${opt.label}`,
							options: [
								{ id: 1, label: "active" },
								{ id: 2, label: "non-active" },
							],
							handler: (value, filter) => {
								if (!filter) return true;
								return (
									value === filter || (!value && filter == 2)
								);
							},
						},
					},
				},
			],
			cell: StatusCell,
		},
	];
</script>

<div class="demo" style="padding: 20px;">
	<h4>Grid with custom filtering in header</h4>
	<div style="height: 400px;">
		<Grid data={allData} {columns} />
	</div>
</div>
