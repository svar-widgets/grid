<script>
	let { data } = $props();
</script>

{#if data}
	<div class="date">
		<i class="wxi-calendar"></i>
		<span>{data.toLocaleDateString()}</span>
	</div>
{:else}
	<span class="empty">no date</span>
{/if}

<style>
	.date {
		height: 100%;
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.date i {
		color: var(--wx-color-primary);
		font-size: 20px;
	}
	.empty {
		color: var(--wx-color-font-disabled);
	}
</style>
