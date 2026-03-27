<script>
	import { onMount } from "svelte";
	import { clickOutside } from "@svar-ui/lib-dom";

	import { Calendar, Dropdown } from "@svar-ui/svelte-core";

	let { editor, onaction, onsave, onapply, oncancel } = $props();

	let value = $state(editor.value || new Date());
	let { template, cell, dropdown = {} } = $state(editor?.config || {});
	const dropdownOptions = $derived({
		trackScroll: true,
		width: "auto",
		...dropdown,
	});

	function updateValue({ value }) {
		onapply(value);
		onsave();
	}

	let node;
	onMount(() => {
		node.focus();
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		}
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="wx-value"
	bind:this={node}
	tabindex="0"
	onclick={oncancel}
	onkeydown={ev => ev.preventDefault()}
>
	{#if template}
		{template(value)}
	{:else if cell}
		{@const SvelteComponent = cell}
		<SvelteComponent data={editor.value} {onaction} />
	{:else}<span class="wx-text">{editor.renderedValue}</span>{/if}
</div>
<Dropdown {...dropdownOptions} {oncancel}>
	<div use:clickOutside={() => onsave(true)}>
		<Calendar
			{value}
			onchange={updateValue}
			buttons={editor.config?.buttons}
		/>
	</div>
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
