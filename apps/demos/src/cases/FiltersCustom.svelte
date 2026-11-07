<script lang="ts">
	import { getData } from "../data";
	import { Grid, type IColumnConfig } from "@svar-ui/svelte-grid";
	import StatusCell from "../custom/StatusCell.svelte";
	import AvatarCell from "../custom/AvatarCell.svelte";

	const { allData, countries, users } = getData();

	const columns: IColumnConfig[] = [
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
		{
			id: "assigned",
			header: [
				"Assigned",
				{
					filter: {
						type: "multiselect",
						config: {
							cell: AvatarCell,
						},
					},
				},
			],
			options: users.map(user => ({ ...user, name: user.label })),
			cell: AvatarCell,
		},
	];
</script>

<div class="demo" style="padding: 20px;">
	<h4>Grid with custom filtering in header</h4>
	<div style="height: 400px;">
		<Grid
			data={allData}
			{columns}
			cellStyle={(_row, column) =>
				column.id === "assigned" ? "vcenter" : ""}
		/>
	</div>
</div>

<style>
	.demo :global(.vcenter) {
		display: flex;
		align-items: center;
	}
	.demo :global(.wx-cell.wx-filter .wx-multiselect .wx-label) {
		display: flex;
		align-items: center;
		padding: 1px 8px;
	}
</style>
