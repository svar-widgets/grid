<script>
	let { data } = $props();
</script>

{#if data}
	<div class="container">
		<div class="avatar">
			<span>{data.label[0]}</span>
		</div>
		<span class="name">{data.label}</span>
	</div>
{:else}
	<span class="empty">not selected</span>
{/if}

<style>
	.container {
		height: 100%;
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.avatar {
		height: 24px;
		width: 24px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--wx-color-primary);
	}
	.avatar span {
		color: white;
		font-weight: 600;
	}
	.empty {
		color: var(--wx-color-font-disabled);
	}
</style>
