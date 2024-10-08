<script>
	import { Grid } from "wx-svelte-grid";
	import { getData } from "./customTable/data";
	import CheckboxCell from "./customTable/CheckboxCell.svelte";
	import StatusCell from "./customTable/StatusCell.svelte";
	import AssignCell from "./customTable/AssignCell.svelte";
	import TagsCell from "./customTable/TagsCell.svelte";
	import StatusStub from "./customTable/StatusStub.svelte";

	const { data, statuses } = getData();

	const columns = [
		{
			id: "id",
			cell: CheckboxCell,
			width: 34,
		},
		{
			id: "taskName",
			header: "Task name",
			// width: 309,
			flexgrow: 1,
			treetoggle: true,
			sort: true,
		},
		{
			id: "status",
			resize: true,
			header: "Status",
			cell: StatusCell,
			width: 133,
			editor: {
				type: "richselect",
				config: { cell: StatusStub },
			},
			options: statuses,
		},
		{
			id: "assign",
			header: "Assign",
			cell: AssignCell,
			width: 219,
		},
		{
			id: "due",
			header: "Due",
			width: 204,
			template: v =>
				v
					? v.toLocaleString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})
					: "",
			editor: "datepicker",
		},
		{
			id: "tags",
			header: "Tags",
			cell: TagsCell,
			width: 211,
		},
	];
</script>

<Grid sizes={{ rowHeight: 73 }} {data} {columns} select={false} tree={true} />

<style>
	:global(.demo .wx-cell) {
		word-break: normal;
		white-space: normal;
		border-right: none;
	}

	:global(.demo .wx-cell:not(:last-child)) {
		border-right: none;
	}
	/*wx-color-background-alt from new tokens*/
	:global(.demo .wx-row:hover) {
		background-color: #f7f7f7;
	}
	:global(.demo .wx-table-box.wx-active .wx-row.wx-selected:hover) {
		background-color: #f7f7f7;
	}
	:global(.wx-willow-dark-theme .demo .wx-row:hover) {
		background-color: #2f343c;
	}
	:global(
			.wx-willow-dark-theme
				.demo
				.wx-table-box.wx-active
				.wx-row.wx-selected:hover
		) {
		background-color: #2f343c;
	}
</style>
