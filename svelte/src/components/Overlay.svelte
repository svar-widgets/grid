<script>
	export let overlay;

	function isComponent(prop) {
		return typeof prop === "function";
	}
</script>

<div class="wx-overlay">
	{#if isComponent(overlay)}
		<svelte:component this={overlay} on:action />
	{:else}{overlay}{/if}
</div>

<style>
	.wx-overlay {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 5;
		background-color: var(--wx-background);
		padding: 14px 8px;
		text-align: center;
	}
</style>
