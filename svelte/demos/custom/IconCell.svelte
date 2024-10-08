<script>
	import { Cell } from "../../src";
	import { createEventDispatcher } from "svelte";

	export let row;
	export let col;
	export let columnStyle;
	export let cellStyle;

	const dispatch = createEventDispatcher();

	function onClick(ev) {
		dispatch("action", {
			action: "custom-icon",
			data: {
				e: ev,
				column: col.id,
				row: row.id,
			},
		});
	}
</script>

<Cell {row} {col} {columnStyle} {cellStyle}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="table_icon" data-action-id={row.id} on:click={onClick}>
		<i class="wxi-dots-h" />
	</div>
	<style>
		.table_icon {
			height: 20px;
			cursor: pointer;
			font-size: 18px;
			text-align: center;
		}
	</style>
</Cell>
