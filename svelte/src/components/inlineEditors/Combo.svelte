<script>
	import { onMount } from "svelte";

	import { SuggestDropdown } from "wx-svelte-core";

	let { actions, editor } = $props();

	let { value, renderedValue: text, options: filterOptions } = $state(editor);
	let template = $state(editor?.config?.template);

	let index = $derived(filterOptions.findIndex(a => a.id === value));

	function updateValue({ id }) {
		actions.updateValue(id);
		actions.save();
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
/>
<SuggestDropdown items={filterOptions} onready={ready} onselect={updateValue}>
	{#snippet children({ option })}
		{#if template}
			{template(option)}
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
