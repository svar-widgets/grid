<script lang="ts">
	import { clickOutside } from "@svar-ui/lib-dom";
	import type { TID } from "@svar-ui/lib-state";
	import type { IInlineEditorProps } from "../../types";
	import MultiSelectInput from "../MultiSelect.svelte";

	let { editor, onaction, onsave, onapply }: IInlineEditorProps = $props();

	const config = $derived(editor?.config || {});
	const options = $derived(editor?.options ?? []);
	const value = $derived((editor?.value || []) as TID[]);
	const text = $derived(editor?.renderedValue);

	const dropdownOptions = $derived({
		trackScroll: true,
		...config?.dropdown,
	});

	function updateValue({ value }: { value: TID[] }) {
		onapply(value);
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="wx-value"
	onclick={() => onsave(true)}
	use:clickOutside={() => onsave(true)}
>
	<MultiSelectInput
		{value}
		{options}
		{text}
		template={config?.template}
		cell={config?.cell}
		clear={config?.clear}
		dropdown={dropdownOptions}
		autoOpen
		onchange={updateValue}
		{onaction}
	/>
</div>

<style>
	.wx-value {
		width: 100%;
		height: 100%;
		background: var(--wx-background);
	}
	.wx-value :global(.wx-multiselect) {
		width: 100%;
		height: 100%;
		border: 1px solid var(--wx-color-primary);
		border-radius: 0;
		background: var(--wx-background);
	}
	.wx-value :global(.wx-multiselect:focus) {
		border: 1px solid var(--wx-color-primary);
	}
</style>
