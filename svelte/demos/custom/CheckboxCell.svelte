<script>
	import { Checkbox } from "wx-svelte-core";
	import { Cell } from "../../src";

	let { row = $bindable(), col, columnStyle, cellStyle, onaction } = $props();

	function onChange(ev) {
		const { value } = ev;
		row[col.id] = value;

		onaction &&
			onaction({
				action: "custom-check",
				data: {
					value,
					column: col.id,
					row: row.id,
				},
			});
	}
</script>

<Cell {row} {col} {columnStyle} {cellStyle}>
	<Checkbox value={row[col.id]} onchange={onChange} />
</Cell>
