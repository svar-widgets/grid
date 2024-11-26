<script>
	import { Cell } from "../../src";

	let { row, col, columnStyle, cellStyle, onaction } = $props();

	function onClick(ev) {
		onaction &&
			onaction({
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
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="table_icon" data-action-id={row.id} onclick={onClick}>
		<i class="wxi-dots-h"></i>
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
