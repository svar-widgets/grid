<script lang="ts">
	import { onMount } from "svelte";
	import type { TID } from "@svar-ui/lib-state";
	import type { IOption } from "@svar-ui/grid-store";
	import {
		OptionSuggestDropdown,
		type TKeydown,
		type TNavigate,
	} from "../../helpers/core";
	import type { IInlineEditorProps } from "../../types";

	let { editor, onaction, onsave, onapply, oncancel }: IInlineEditorProps =
		$props();

	const value = $derived(editor.value);
	// svelte-ignore state_referenced_locally
	let { renderedValue: text, options: filterOptions } = $state(
		editor as { renderedValue: string; options: IOption[] }
	);

	const { template, cell, dropdown = {} } = $derived(editor?.config || {});

	const dropdownOptions = $derived({ trackScroll: true, ...dropdown });

	let index = $derived(filterOptions.findIndex(a => a.id === value));

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

	function input() {
		filterOptions = text
			? editor.options!.filter(i =>
					i.label.toLowerCase().includes(text.toLowerCase())
				)
			: editor.options!;

		if (filterOptions.length) navigate(-Infinity);
		else navigate(null);
	}

	let node = $state<HTMLInputElement>();
	onMount(() => {
		node!.focus();
	});
</script>

<input
	class="wx-input"
	bind:this={node}
	bind:value={text}
	oninput={input}
	onkeydown={e => keydown!(e, index)}
/>
<OptionSuggestDropdown
	items={filterOptions}
	onready={ready}
	onselect={updateValue}
	{...dropdownOptions}
	oncancel={() => oncancel(true)}
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
	.wx-input {
		height: 100%;
		width: 100%;
		border: none;
		outline: none;
		padding-left: 8px;
		font: inherit;
		background: var(--wx-background);
		color: var(--wx-color-font);
		border: 1px solid var(--wx-color-primary);
	}
</style>
