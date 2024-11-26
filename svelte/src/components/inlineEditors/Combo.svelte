<script>
	import { onMount } from "svelte";

	import { SuggestDropdown } from "wx-svelte-core";

	let { actions, editor, children } = $props();

	let template = $state();

	if (editor.config && editor.config.template) {
		template = editor.config.template;
	}

	let text = $state(editor.renderedValue);
	let filterOptions = $state(editor.options);

	function updateValue({ id }) {
		actions.updateValue(id);
		actions.save();
	}

	let navigate;
	let keydown = $state();

	function ready(ev) {
		navigate = ev.navigate;
		keydown = ev.keydown;
		navigate(index());
	}

	function input() {
		filterOptions = text
			? editor.options.filter(i =>
					i.name.toLowerCase().includes(text.toLowerCase())
				)
			: editor.options;

		if (filterOptions.length) navigate(-Infinity);
		else navigate(null);
	}

	let node = $state();
	onMount(() => {
		node.focus();
	});

	const index = () => filterOptions.findIndex(a => a.id === editor.value);

	const children_render = $derived(children);
</script>

<input
	class="wx-input"
	bind:this={node}
	bind:value={text}
	oninput={input}
	onkeydown={e => keydown(e, index())}
/>
<SuggestDropdown items={filterOptions} onready={ready} onselect={updateValue}>
	{#snippet children({ option })}
		{#if children_render}{@render children_render({
				option,
			})}{:else if template}{template(option)}{:else}{option.name}{/if}
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
