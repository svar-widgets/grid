<script>
	import { createEventDispatcher } from "svelte";
	import { getStyle } from "../../helpers/columnWidth";
	import { clickOutside } from "wx-lib-dom";

	import { editors } from "./editors";

	export let col;
	export let editor;

	const dispatch = createEventDispatcher();

	function save() {
		dispatch("action", {
			action: "close-editor",
			data: { ignore: false },
		});
	}

	function cancel() {
		dispatch("action", {
			action: "close-editor",
			data: { ignore: true },
		});
	}

	function updateValue(value) {
		dispatch("action", {
			action: "editor",
			data: {
				value,
			},
		});
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
		{editor}
		actions={{ save, cancel, updateValue }}
		on:action
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
