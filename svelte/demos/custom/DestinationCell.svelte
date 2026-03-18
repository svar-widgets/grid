<script>
	let { row, column } = $props();
	const countriesCount = $derived(data.length);

	let data = $derived.by(() => {
		const ids = row[column.id];
		const options = column.options;
		if (!Array.isArray(ids) || !options) return [];
		return ids.map(id => options.find(o => o.id == id)).filter(Boolean);
	});
</script>

<span>
	{#if countriesCount && countriesCount <= 3}
		{data.map(item => item.label).join(", ")}
	{:else if countriesCount > 3}
		{data
			.slice(0, 3)
			.map(item => item.label)
			.join(", ")} and {countriesCount - 3} more
	{:else}
		<span class="empty">not selected</span>
	{/if}
</span>

<style>
	.empty {
		color: var(--wx-color-font-disabled);
	}
</style>
