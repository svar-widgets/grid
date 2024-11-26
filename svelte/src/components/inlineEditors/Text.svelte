<script>
	import { onMount } from "svelte";

	let { actions, editor } = $props();

	let value = $state(editor.value || "");

	let node = $state();
	onMount(() => node.focus());

	function updateValue() {
		value = node.value;
		actions.updateValue(node.value);
	}

	function closeAndSave({ key }) {
		if (key === "Enter") actions.save();
	}
</script>

<input
	class="wx-text"
	oninput={updateValue}
	onkeydown={closeAndSave}
	bind:this={node}
	type="text"
	{value}
/>

<style>
	.wx-text {
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
		padding-left: 8px;
		font: inherit;
		background: var(--wx-background);
		color: var(--wx-color-font);
		border: 1px solid var(--wx-color-primary);
	}
</style>
