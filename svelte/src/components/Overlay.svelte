<script>
	import { getContext } from "svelte";
	let { overlay } = $props();

	const api = getContext("grid-store");
	function isComponent(prop) {
		return typeof prop === "function";
	}
</script>

<div class="wx-overlay">
	{#if isComponent(overlay)}
		{@const SvelteComponent = overlay}
		<SvelteComponent
			onaction={({ action, data }) => api.exec(action, data)}
		/>
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
