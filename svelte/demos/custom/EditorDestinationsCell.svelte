<script>
	let { data } = $props();
	const countriesCount = $derived(data.length);
</script>

{#if Array.isArray(data)}
	<div>
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
	</div>
{:else}
	<div class="custom-option">
		<div class="info">
			<div class="label">
				{data.flag}
				{data.label}
			</div>
			<div class="code">({data.code})</div>
		</div>
	</div>
{/if}

<style>
	.empty {
		color: var(--wx-color-font-disabled);
	}
	.custom-option {
		display: flex;
		flex-direction: row;
		width: 100%;
		gap: 4px;
	}
	.info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.code {
		font-size: 12px;
		font-style: italic;
		color: var(--wx-color-font-disabled);
	}
</style>
