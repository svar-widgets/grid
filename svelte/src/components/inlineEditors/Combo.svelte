<script>
	import { onMount } from "svelte";

	import { SuggestDropdown } from "wx-svelte-core";

	export let actions;
	export let editor;

	let template;

	if (editor.config && editor.config.template) {
		template = editor.config.template;
	}

	let text = editor.renderedValue;
	let filterOptions = editor.options;

	function updateValue({ detail }) {
		const value = detail.id;

		actions.updateValue(value);
		actions.save();
	}

	let navigate;
	let keydown;

	function ready(ev) {
		navigate = ev.detail.navigate;
		keydown = ev.detail.keydown;
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

	let node;
	onMount(() => {
		node.focus();
	});

	const index = () => filterOptions.findIndex(a => a.id === editor.value);
</script>

<input
	class="wx-input"
	bind:this={node}
	bind:value={text}
	on:input={input}
	on:keydown={e => keydown(e, index())}
/>
<SuggestDropdown
	let:option
	items={filterOptions}
	on:ready={ready}
	on:select={updateValue}
>
	<slot {option}>
		{#if template}{template(option)}{:else}{option.name}{/if}
	</slot>
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
