<script>
	import { onMount } from "svelte";

	import { SuggestDropdown } from "wx-svelte-core";

	export let actions;
	export let editor;

	$: data = editor.options.find(opt => opt.id === editor.value);

	let template;
	let cell;

	$: if (editor.config) {
		({ template, cell } = editor.config);
	}

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

	const index = () => editor.options.findIndex(a => a.id === editor.value);
	let node;
	onMount(() => {
		node.focus();
		if (window && window.getSelection) {
			window.getSelection().removeAllRanges();
		}
	});
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
	bind:this={node}
	class="wx-value"
	tabindex="0"
	on:click={actions.cancel()}
	on:keydown={ev => keydown(ev, index())}
>
	{#if template}
		{template(data)}
	{:else if cell}
		<svelte:component this={cell} {data} on:action />
	{:else}<span class="wx-text">{editor.renderedValue}</span>{/if}
</div>
<SuggestDropdown
	let:option
	items={editor.options}
	on:ready={ready}
	on:select={updateValue}
>
	<slot {option}>
		{#if template}
			{template(option)}
		{:else if cell}
			<svelte:component this={cell} data={option} on:action />
		{:else}{option.name}{/if}
	</slot>
</SuggestDropdown>

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
