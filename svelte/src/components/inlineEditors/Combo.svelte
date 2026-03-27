<script>
	import { onMount } from "svelte";
	import { SuggestDropdown } from "@svar-ui/svelte-core";
	import { clickOutside } from "@svar-ui/lib-dom";

	let { editor, onaction, onsave, onapply, oncancel } = $props();

	let { value, renderedValue: text, options: filterOptions } = $state(editor);

	let { template, cell, dropdown = {} } = $state(editor?.config || {});

	const dropdownOptions = $derived({ trackScroll: true, ...dropdown });

	let index = $derived(filterOptions.findIndex(a => a.id === value));

	function updateValue({ id }) {
		onapply(id);
		onsave();
	}

	let navigate;
	let keydown = $state();

	function ready(ev) {
		navigate = ev.navigate;
		keydown = ev.keydown;
		navigate(index);
	}

	function input() {
		filterOptions = text
			? editor.options.filter(i =>
					i.label.toLowerCase().includes(text.toLowerCase())
				)
			: editor.options;

		if (filterOptions.length) navigate(-Infinity);
		else navigate(null);
	}

	let node = $state();
	onMount(() => {
		node.focus();
	});
</script>

<input
	class="wx-input"
	bind:this={node}
	bind:value={text}
	oninput={input}
	onkeydown={e => keydown(e, index)}
	use:clickOutside={() => onsave(true)}
/>
<SuggestDropdown
	items={filterOptions}
	onready={ready}
	onselect={updateValue}
	{...dropdownOptions}
	{oncancel}
>
	{#snippet children({ option })}
		{#if template}
			{template(option)}
		{:else if cell}
			{@const SvelteComponent_1 = cell}
			<SvelteComponent_1 data={option} {onaction} />
		{:else}{option.label}{/if}
	{/snippet}
</SuggestDropdown>

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
