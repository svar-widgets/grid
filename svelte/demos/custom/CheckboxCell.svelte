<script>
	import { createEventDispatcher } from "svelte";
	import { Checkbox } from "wx-svelte-core";
	import { Cell } from "../../src";

	const dispatch = createEventDispatcher();

	export let row;
	export let col;
	export let columnStyle;
	export let cellStyle;

	function onChange(ev) {
		const { value } = ev.detail;
		dispatch("action", {
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
	<Checkbox bind:value={row[col.id]} on:change={onChange} />
</Cell>
