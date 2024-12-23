<script>
	import { Checkbox } from "wx-svelte-core";
	import { Cell } from "../../src";

	let { row, col, columnStyle, cellStyle, onaction } = $props();

	function onChange(ev) {
		const { value } = ev;

		onaction &&
			onaction({
				action: "select-row",
				data: {
					id: row.id,
					mode: value,
					toggle: true,
				},
			});
	}
</script>

<Cell {row} {col} {columnStyle} {cellStyle}>
	<div data-action="ignore-click">
		<Checkbox onchange={onChange} />
	</div>
</Cell>
