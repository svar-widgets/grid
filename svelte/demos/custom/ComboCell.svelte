<script>
	import { createEventDispatcher } from "svelte";
	import { Combo } from "wx-svelte-core";
	import { Cell } from "../../src";

	const dispatch = createEventDispatcher();

	export let row;
	export let col;
	export let columnStyle;
	export let cellStyle;

	let id;

	const options = [
		{ id: 1, label: "New Amieshire" },
		{ id: 2, label: "New Gust" },
		{ id: 3, label: "Lefflerstad" },
		{ id: 4, label: "East Catalina" },
		{ id: 5, label: "Ritchieborough" },
	];

	$: {
		const option = options.find(i => i.label === row[col.id]);
		id = option && option.id ? option.id : 1;
	}

	function onChange(ev) {
		const { value } = ev.detail;
		dispatch("action", {
			action: "custom-combo",
			data: {
				value: options.find(i => i.id === value).label,
				column: col.id,
				row: row.id,
			},
		});
	}
</script>

<Cell {row} {col} {columnStyle} {cellStyle}>
	<Combo {options} let:option value={id} on:change={onChange}>
		{option.label}
	</Combo>
</Cell>
