<script>
	import { onMount } from "svelte";
	import { SuggestDropdown } from "wx-svelte-core";

	let { actions, editor, children } = $props();

	let data = $derived(editor.options.find(opt => opt.id === editor.value));

	let template = $derived(editor?.config?.template);
	let cell = $derived(editor?.config?.cell);

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

	const index = () => editor.options.findIndex(a => a.id === editor.value);
	let node = $state();
	onMount(() => {
		node.focus();
		if (window && window.getSelection) {
			window.getSelection().removeAllRanges();
		}
	});

	const children_render = $derived(children);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	bind:this={node}
	class="wx-value"
	tabindex="0"
	onclick={actions.cancel()}
	onkeydown={ev => keydown(ev, index())}
>
	{#if template}
		{template(data)}
	{:else if cell}
		{@const SvelteComponent = cell}
		<SvelteComponent {data} onaction />
	{:else}<span class="wx-text">{editor.renderedValue}</span>{/if}
</div>
<SuggestDropdown items={editor.options} onready={ready} onselect={updateValue}>
	{#snippet children({ option })}
		{#if children_render}{@render children_render({
				option,
			})}{:else if template}
			{template(option)}
		{:else if cell}
			{@const SvelteComponent_1 = cell}
			<SvelteComponent_1 data={option} onaction />
		{:else}{option.name}{/if}
	{/snippet}
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
