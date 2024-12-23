<script>
	import { getContext } from "svelte";
	import { getStyle } from "../../helpers/columnWidth";
	import { clickOutside } from "wx-lib-dom";
	import { editors } from "./editors";

	let { col } = $props();

	const api = getContext("grid-store");
	const { editor } = api.getReactiveState();

	function save() {
		api.exec("close-editor", { ignore: false });
	}

	function cancel() {
		api.exec("close-editor", { ignore: true });
	}

	function updateValue(value) {
		api.exec("editor", { value });
	}

	let style = $derived(
		getStyle(col.width, col.flexgrow, col.fixed, col.left)
	);

	const SvelteComponent = $derived(editors[col.editor.type]);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="wx-cell"
	{style}
	class:wx-shadow={col.fixed === -1}
	use:clickOutside={save}
	onclick={ev => ev.stopPropagation()}
	ondblclick={ev => ev.stopPropagation()}
>
	<SvelteComponent
		editor={$editor}
		actions={{ save, cancel, updateValue }}
		onaction={({ action, data }) => api.exec(action, data)}
	/>
</div>

<style>
	.wx-cell {
		box-sizing: border-box;
		padding: 0;
		background-color: var(--wx-background);
		color: var(--wx-color-font);
		position: relative;
		z-index: 2;
	}
	.wx-cell :global(.wx-dropdown) {
		border: var(--wx-table-editor-dropdown-border);
		box-shadow: var(--wx-table-editor-dropdown-shadow);
	}
</style>
