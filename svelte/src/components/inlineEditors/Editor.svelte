<script>
	import { getContext } from "svelte";
	import { getStyle } from "../../helpers/columnWidth";
	import { clickOutside } from "wx-lib-dom";
	import { editors } from "./editors";

	export let col;

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

	let style;
	$: style = getStyle(col.width, col.flexgrow, col.fixed, col.left);
</script>

<div
	class="wx-cell"
	{style}
	class:wx-shadow={col.fixed === -1}
	use:clickOutside={save}
>
	<svelte:component
		this={editors[col.editor.type]}
		editor={$editor}
		actions={{ save, cancel, updateValue }}
		on:action={({ detail }) => api.exec(detail.action, detail.data)}
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
	.wx-shadow {
		box-shadow: var(--wx-table-fixed-column-shadow);
	}
	.wx-cell :global(.wx-dropdown) {
		border: var(--wx-table-editor-dropdown-border);
		box-shadow: var(--wx-table-editor-dropdown-shadow);
	}
</style>
