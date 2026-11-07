<script lang="ts">
	import { onMount } from "svelte";
	import { clickOutside } from "@svar-ui/lib-dom";
	import type { IInlineEditorProps } from "../../types";

	let { editor, onsave, onapply }: IInlineEditorProps = $props();

	// svelte-ignore state_referenced_locally
	let value = $state(editor.value || "");
	let { type = "text" } = $derived(
		(editor?.config || {}) as { type?: string }
	);

	let node = $state<HTMLInputElement>();
	onMount(() => node!.focus());

	function updateValue() {
		value = node!.value;
		onapply(node!.value);
	}

	function closeAndSave({ key }: KeyboardEvent) {
		if (key === "Enter") onsave();
	}
</script>

<input
	use:clickOutside={() => onsave(true)}
	class="wx-text"
	oninput={updateValue}
	onkeydown={closeAndSave}
	bind:this={node}
	{type}
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
