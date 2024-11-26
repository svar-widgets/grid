<script>
	import { onMount } from "svelte";

	import { Calendar, Dropdown } from "wx-svelte-core";

	let { actions, editor } = $props();

	let value = $state(editor.value || new Date());

	let template = $derived(editor?.config?.template);
	let cell = $derived(editor?.config?.cell);

	function updateValue({ value }) {
		actions.updateValue(value);
		actions.save();
	}

	onMount(() => {
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		}
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="wx-value" onclick={actions.cancel()}>
	{#if template}
		{template(value)}
	{:else if cell}
		{@const SvelteComponent = cell}
		<SvelteComponent data={value} onaction />
	{:else}<span class="wx-text">{editor.renderedValue}</span>{/if}
</div>
<Dropdown width={"auto"}>
	<Calendar bind:value onchange={updateValue} />
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
