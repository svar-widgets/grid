<script lang="ts">
	import { onMount } from "svelte";
	import { clickOutside } from "@svar-ui/lib-dom";
	import type { TID } from "@svar-ui/lib-state";
	import {
		OptionSuggestDropdown,
		type TKeydown,
		type TNavigate,
	} from "../../helpers/core";
	import type { IInlineEditorProps } from "../../types";

	let { editor, onaction, onsave, onapply, oncancel }: IInlineEditorProps =
		$props();

	const data = $derived(editor.options!.find(opt => opt.id === editor.value));
	const { value, options } = $derived(editor);
	const { template, cell, dropdown = {} } = $derived(editor?.config || {});
	const dropdownOptions = $derived({ trackScroll: true, ...dropdown });

	let index = $derived(options!.findIndex(a => a.id === value));

	function updateValue({ id }: { id: TID | TID[] }) {
		onapply(id);
		onsave();
	}

	let navigate: TNavigate;
	let keydown = $state<TKeydown>();

	function ready(ev: { navigate?: TNavigate; keydown?: TKeydown }) {
		navigate = ev.navigate!;
		keydown = ev.keydown;
		navigate(index);
	}

	let node = $state<HTMLElement>();
	onMount(() => {
		node!.focus();
		if (window && window.getSelection) {
			window.getSelection()!.removeAllRanges();
		}
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	bind:this={node}
	class="wx-value"
	tabindex="0"
	onclick={oncancel}
	onkeydown={ev => {
		keydown!(ev, index);
		ev.preventDefault();
	}}
	use:clickOutside={() => onsave(true)}
>
	{#if template}
		{template(data)}
	{:else if cell}
		{@const SvelteComponent = cell}
		<SvelteComponent {data} {onaction} />
	{:else}<span class="wx-text">{editor.renderedValue}</span>{/if}
</div>
<OptionSuggestDropdown
	items={options}
	onready={ready}
	onselect={updateValue}
	{...dropdownOptions}
>
	{#snippet children({ option })}
		{#if template}
			{template(option)}
		{:else if cell}
			{@const SvelteComponent_1 = cell}
			<SvelteComponent_1 data={option} {onaction} />
		{:else}{option.label}{/if}
	{/snippet}
</OptionSuggestDropdown>

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
	}

	.wx-value:focus {
		outline: none;
		display: block;
	}
</style>
