<script>
	import { Checkbox } from "wx-svelte-core";
	import { Cell } from "../../src";

	let { row, col, columnStyle, cellStyle, api } = $props();

	const selectedRows = api.getReactiveState().selectedRows;

	function onChange(ev) {
		const { value } = ev;

		api.exec("select-row", {
			id: row.id,
			mode: value,
			toggle: true,
		});
	}
</script>

<Cell {row} {col} {columnStyle} {cellStyle}>
	<div data-action="ignore-click">
		<Checkbox
			onchange={onChange}
			value={$selectedRows.indexOf(row.id) !== -1}
		/>
	</div>
</Cell>
