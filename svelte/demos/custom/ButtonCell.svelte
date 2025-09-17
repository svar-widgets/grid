<script>
	import { Button } from "@svar-ui/svelte-core";

	let { row, column, onaction } = $props();

	function onClick() {
		onaction &&
			onaction({
				action: "custom-button",
				data: {
					column: column.id,
					row: row.id,
				},
			});
	}
</script>

<span class="name">{row[column.id] || "Unknown"}</span>
<Button type="primary" disabled={!row[column.id]} onclick={onClick}>
	Show on map
</Button>

<style>
	.name {
		margin-top: 6px;
		display: inline-block;
		width: 100px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
