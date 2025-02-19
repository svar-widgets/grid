<script>
	import { Combo } from "wx-svelte-core";

	let { row, column, onaction } = $props();

	const options = [
		{ id: 1, label: "New Amieshire" },
		{ id: 2, label: "New Gust" },
		{ id: 3, label: "Lefflerstad" },
		{ id: 4, label: "East Catalina" },
		{ id: 5, label: "Ritchieborough" },
	];

	const id = $derived.by(() => {
		const option = options.find(i => i.label === row[column.id]);
		return option && option.id ? option.id : 1;
	});

	function onChange(ev) {
		const { value } = ev;
		onaction &&
			onaction({
				action: "custom-combo",
				data: {
					value: options.find(i => i.id === value).label,
					column: column.id,
					row: row.id,
				},
			});
	}
</script>

<Combo {options} value={id} onchange={onChange}>
	{#snippet children({ option })}
		{option.label}
	{/snippet}
</Combo>
