<script>
	import { onMount } from "svelte";

	import { Calendar, Dropdown } from "wx-svelte-core";

	export let actions;
	export let editor;

	let value = editor.value || new Date();

	let template;
	let cell;

	$: if (editor.config) {
		({ template, cell } = editor.config);
	}

	function updateValue({ detail }) {
		const value = detail.value;

		actions.updateValue(value);
		actions.save();
	}

	onMount(() => {
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		}
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="wx-value" on:click={actions.cancel()}>
	{#if template}
		{template(value)}
	{:else if cell}
		<svelte:component this={cell} data={value} on:action />
	{:else}<span class="wx-text">{editor.renderedValue}</span>{/if}
</div>
<Dropdown width={"auto"}>
	<Calendar bind:value on:change={updateValue} />
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
