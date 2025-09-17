<script>
	import { onMount } from "svelte";
	import { SuggestDropdown } from "@svar-ui/svelte-core";

	let { actions, editor, onaction } = $props();

	let data = $state(editor.options.find(opt => opt.id === editor.value));
	let { value, options } = $state(editor);
	let { template, cell } = $state(editor?.config || {});

	let index = $derived(options.findIndex(a => a.id === value));

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

	let node = $state();
	onMount(() => {
		node.focus();
		if (window && window.getSelection) {
			window.getSelection().removeAllRanges();
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
	onclick={() => actions.cancel()}
	onkeydown={ev => {
		keydown(ev, index);
		ev.preventDefault();
	}}
>
	{#if template}
		{template(data)}
	{:else if cell}
		{@const SvelteComponent = cell}
		<SvelteComponent {data} {onaction} />
	{:else}<span class="wx-text">{editor.renderedValue}</span>{/if}
</div>
<SuggestDropdown items={options} onready={ready} onselect={updateValue}>
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
