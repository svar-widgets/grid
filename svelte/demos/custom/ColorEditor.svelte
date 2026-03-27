<script>
	import { onMount } from "svelte";
	import { ColorBoard, Dropdown } from "@svar-ui/svelte-core";
	import { clickOutside } from "@svar-ui/lib-dom";

	let { editor, onsave, onapply, oncancel } = $props();
	let value = $state(editor.value);

	function updateValue({ value, input }) {
		if (input) onapply(value);
		else onsave();
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
<div class="value" bind:this={node} tabindex="0" onclick={oncancel}>
	{value}
</div>
<Dropdown width={"auto"} trackScroll={true} {oncancel}>
	<div use:clickOutside={() => onsave(true)}>
		<ColorBoard {value} onchange={updateValue} button={true} />
	</div>
</Dropdown>

<style>
	.value {
		width: 100%;
		height: 100%;
		padding: 8px;
		outline: none;
		border: 1px solid var(--wx-color-primary);
	}
</style>
