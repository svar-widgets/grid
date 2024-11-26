<script>
	import { Combo } from "wx-svelte-core";
	import { Cell } from "../../src";

	let { row, col, columnStyle, cellStyle, onaction } = $props();

	const options = [
		{ id: 1, label: "New Amieshire" },
		{ id: 2, label: "New Gust" },
		{ id: 3, label: "Lefflerstad" },
		{ id: 4, label: "East Catalina" },
		{ id: 5, label: "Ritchieborough" },
	];

	const id = $derived.by(() => {
		const option = options.find(i => i.label === row[col.id]);
		return option && option.id ? option.id : 1;
	});

	function onChange(ev) {
		const { value } = ev;
		onaction &&
			onaction({
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
	<Combo {options} value={id} onchange={onChange}>
		{#snippet children({ option })}
			{option.label}
		{/snippet}
	</Combo>
</Cell>
