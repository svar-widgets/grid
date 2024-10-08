<script>
	import { Button } from "wx-svelte-core";
	import { Cell } from "../../src";
	import { createEventDispatcher } from "svelte";

	export let row;
	export let col;
	export let columnStyle;
	export let cellStyle;

	const dispatch = createEventDispatcher();

	function onClick() {
		dispatch("action", {
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
	<Button type="primary" disabled={!row[col.id]} click={onClick} height="100">
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
