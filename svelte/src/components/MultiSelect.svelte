<script>
	import { onMount } from "svelte";
	import { SuggestDropdown } from "@svar-ui/svelte-core";

	let {
		value = $bindable([]),
		options = [],
		placeholder = "",
		clear = false,
		text = null,
		template = null,
		cell = null,
		dropdown = {},
		autoOpen = false,
		onchange,
		onaction,
	} = $props();

	const selected = $derived(
		(value || []).map(id => options.find(o => o.id === id)).filter(Boolean)
	);

	let node = $state();
	let navigate;
	let keydown;
	function ready(ev) {
		navigate = ev.navigate;
		keydown = ev.keydown;
		if (autoOpen) navigate(index());
	}

	onMount(() => {
		if (autoOpen) {
			node?.focus();
			if (window?.getSelection) window.getSelection().removeAllRanges();
		}
	});

	const index = () => {
		const v = value || [];
		if (!v.length) return 0;
		const firstSelected = options.find(o => v.includes(o.id));
		return firstSelected ? options.indexOf(firstSelected) : 0;
	};

	function select({ id }) {
		value = id;
		onchange && onchange({ value });
	}

	function unselect(ev) {
		ev.stopPropagation();
		value = [];
		onchange && onchange({ value });
	}

	function onclick() {
		navigate?.(index());
	}

	function oncancel() {
		navigate?.(null);
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={node}
	class="wx-multiselect"
	{onclick}
	onkeydown={ev => keydown?.(ev, index())}
	tabindex="0"
>
	<div class="wx-label">
		{#if template}
			{template(selected)}
		{:else if cell}
			{@const CellComponent = cell}
			<CellComponent data={selected} {onaction} />
		{:else if text}
			<span class="wx-text">{text}</span>
		{:else if selected.length}
			<span class="wx-text">{selected.map(s => s.label).join(", ")}</span>
		{:else if placeholder}
			<span class="wx-placeholder">{placeholder}</span>
		{:else}&nbsp;{/if}
	</div>

	{#if clear && value?.length}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<i class="wx-icon wxi-close" onclick={unselect}></i>
	{:else}<i class="wx-icon wxi-angle-down"></i>{/if}

	<SuggestDropdown
		items={options}
		onready={ready}
		onselect={select}
		multiselect={true}
		checkboxes={true}
		value={value || []}
		{oncancel}
		{...dropdown}
	>
		{#snippet children({ option })}
			<div class="wx-option">
				{#if template}
					{template(option)}
				{:else if cell}
					{@const CellComponent = cell}
					<CellComponent data={option} {onaction} />
				{:else}{option.label}{/if}
			</div>
		{/snippet}
	</SuggestDropdown>
</div>

<style>
	.wx-multiselect {
		position: relative;
		outline: none;
		width: var(--wx-input-width);
		min-height: var(--wx-input-height);
		border: var(--wx-input-border);
		border-radius: var(--wx-input-border-radius);
		background: var(--wx-input-background);
		cursor: pointer;
	}
	.wx-multiselect:focus {
		border: var(--wx-input-border-focus);
	}

	.wx-label {
		position: relative;
		top: 50%;
		transform: translateY(-50%);
		display: block;
		width: 100%;
		font-family: var(--wx-input-font-family);
		font-size: var(--wx-input-font-size);
		line-height: var(--wx-input-line-height);
		font-weight: var(--wx-input-font-weight);
		text-align: var(--wx-input-text-align);
		color: var(--wx-input-font-color);
		padding: var(--wx-input-padding);
		padding-right: calc(
			var(--wx-input-icon-size) + var(--wx-input-icon-indent) * 2
		);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.wx-text {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.wx-placeholder {
		color: var(--wx-input-placeholder-color);
	}

	.wx-icon {
		position: absolute;
		right: var(--wx-input-icon-indent);
		top: 50%;
		transform: translateY(-50%);
		font-size: var(--wx-input-icon-size);
		line-height: 1;
		width: var(--wx-input-icon-size);
		height: var(--wx-input-icon-size);
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: none;
		user-select: none;
		color: var(--wx-input-icon-color);
	}
	.wx-icon:before {
		display: block;
	}
	.wx-icon.wxi-close {
		pointer-events: all;
	}
	.wx-icon.wxi-close:hover {
		background: var(--wx-background-hover);
		border-radius: var(--wx-icon-border-radius);
	}

	.wx-option {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 8px;
	}
</style>
