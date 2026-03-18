<script>
	import { SuggestDropdown } from "@svar-ui/svelte-core";
	import { clickOutside } from "@svar-ui/lib-dom";
	import { onMount } from "svelte";

	let { editor, onaction, onsave, onapply, oncancel } = $props();
	let { config } = $state(editor);

	const options = $derived(editor?.options ?? []);
	let value = $derived(editor?.value || []);
	let renderedValue = $derived(editor?.renderedValue);
	let index = $derived.by(() => {
		const firstSelected = options.find(opt => value.includes(opt.id));
		return firstSelected ? options.indexOf(firstSelected) : -1;
	});

	function updateValue({ id }) {
		onapply(id);
		node.focus();
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
	onclick={oncancel}
	onkeydown={ev => {
		keydown(ev, index);
		ev.preventDefault();
	}}
	use:clickOutside={() => onsave(true)}
>
	{#if config?.template}
		{config.template(value?.map(id => options.find(opt => opt.id === id)))}
	{:else if config?.cell}
		{@const SvelteComponent = config.cell}
		<SvelteComponent
			data={value.map(id => options.find(opt => opt.id === id))}
		/>
	{:else}
		<span class="wx-text">{renderedValue}</span>
	{/if}
</div>

<SuggestDropdown
	items={options}
	onready={ready}
	onselect={updateValue}
	checkboxes={true}
	multiselect={true}
	{value}
>
	{#snippet children({ option })}
		<div class="wx-option">
			{#if config?.template}
				{config.template(option)}
			{:else if config?.cell}
				{@const SvelteComponent = config.cell}
				<SvelteComponent data={option} {onaction} />
			{:else}
				{option.label}
			{/if}
		</div>
	{/snippet}
</SuggestDropdown>

<style>
	.wx-option {
		display: flex;
		direction: row;
		align-items: center;
		justify-content: flex-start;
		gap: 8px;
	}
	.wx-text {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.wx-value {
		width: 100%;
		height: 100%;
		padding: 8px;
		overflow: hidden;
		outline: none;
		border: 1px solid var(--wx-color-primary);
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
