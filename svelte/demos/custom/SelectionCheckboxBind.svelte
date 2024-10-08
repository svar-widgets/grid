<script>
	import { Checkbox } from "wx-svelte-core";
	import { Cell } from "../../src";

	export let row;
	export let col;
	export let columnStyle;
	export let cellStyle;
	export let api;

	const selectedRows = api.getReactiveState().selectedRows;

	function onChange(ev) {
		const { value } = ev.detail;

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
			on:change={onChange}
			value={$selectedRows.indexOf(row.id) !== -1}
		/>
	</div>
</Cell>
