<script>
	import { createEventDispatcher } from "svelte";
	import { Checkbox } from "wx-svelte-core";
	import { Cell } from "../../src";

	export let row;
	export let col;
	export let columnStyle;
	export let cellStyle;

	const dispatch = createEventDispatcher();

	function onChange(ev) {
		const { value } = ev.detail;

		dispatch("action", {
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
		<Checkbox on:change={onChange} />
	</div>
</Cell>
