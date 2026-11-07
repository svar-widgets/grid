<script lang="ts">
	import { onMount } from "svelte";

	import { Calendar, Dropdown } from "@svar-ui/svelte-core";
	import type { IInlineEditorProps } from "../../types";

	let { editor, onaction, onsave, onapply, oncancel }: IInlineEditorProps =
		$props();

	const value = $derived((editor.value || new Date()) as Date);
	const { template, cell, dropdown = {} } = $derived(editor?.config || {});
	const dropdownOptions = $derived({
		trackScroll: true,
		width: "auto",
		...dropdown,
	});

	function updateValue({ value }: { value?: Date | null }) {
		onapply(value);
		onsave();
	}

	let node: HTMLElement;
	onMount(() => {
		node.focus();
		if (window.getSelection) {
			window.getSelection()!.removeAllRanges();
		}
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="wx-value"
	bind:this={node}
	tabindex="0"
	onclick={oncancel}
	onkeydown={ev => ev.preventDefault()}
>
	{#if template}
		{template(value)}
	{:else if cell}
		{@const SvelteComponent = cell}
		<SvelteComponent data={editor.value} {onaction} />
	{:else}<span class="wx-text">{editor.renderedValue}</span>{/if}
</div>
<Dropdown {...dropdownOptions} oncancel={() => oncancel(true)}>
	<Calendar {value} onchange={updateValue} buttons={editor.config?.buttons} />
</Dropdown>

<style>
	.wx-value {
		width: 100%;
		height: 100%;
		padding: 8px;
		overflow: hidden;
		outline: none;
		border: 1px solid var(--wx-color-primary);
	}
	.wx-text {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
	}
</style>
