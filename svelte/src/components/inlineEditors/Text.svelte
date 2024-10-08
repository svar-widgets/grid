<script>
	import { onMount } from "svelte";

	export let actions;
	export let editor;

	let value = "";

	const reset = e => (value = e.value);
	$: reset(editor);

	let node;
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
	on:input={updateValue}
	on:keydown={closeAndSave}
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
