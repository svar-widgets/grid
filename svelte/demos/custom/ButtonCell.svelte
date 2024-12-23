<script>
	import { Button } from "wx-svelte-core";
	import { Cell } from "../../src";

	let { row, col, columnStyle, cellStyle, onaction } = $props();

	function onClick() {
		onaction &&
			onaction({
				action: "custom-button",
				data: {
					column: col.id,
					row: row.id,
				},
			});
	}
</script>

<Cell {row} {col} {columnStyle} {cellStyle}>
	<span class="name">{row[col.id] || "Unknown"}</span>
	<Button
		type="primary"
		disabled={!row[col.id]}
		onclick={onClick}
		height="100"
	>
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
</Cell>
