<script>
	import { getContext } from "svelte";
	import { getStyle } from "../../helpers/columnWidth";
	import { clickOutside } from "@svar-ui/lib-dom";
	import { editors } from "./editors";

	let { column, row } = $props();

	const api = getContext("grid-store");
	const { editor } = api.getReactiveState();

	function save(ignoreFocus) {
		const cell = ignoreFocus
			? null
			: { row: $editor.id, column: $editor.column };
		closeEditor(false, cell);
	}

	function cancel() {
		closeEditor(true, { row: $editor.id, column: $editor.column });
	}

	function updateValue(value) {
		api.exec("editor", { value });
	}

	function closeEditor(ignore, cell) {
		api.exec("close-editor", { ignore });
		if (cell) {
			api.exec("focus-cell", {
				...cell,
				eventSource: "click",
			});
		}
	}

	function keyHandler(ev) {
		if (ev.key === "Enter" && $editor) cancel();
	}

	let style = $derived(
		getStyle(
			column.width,
			column.flexgrow,
			column.fixed,
			column.left,
			column.right
		)
	);

	const SvelteComponent = $derived.by(() => {
		let editor = column.editor;
		if (typeof editor === "function") editor = editor(row, column);
		let type = typeof editor === "string" ? editor : editor.type;
		return editors[type];
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="wx-cell wx-editor"
	{style}
	role={typeof row.$parent !== "undefined" ? "gridcell" : "cell"}
	aria-readonly={typeof row.$parent !== "undefined"
		? column.editor
			? false
			: true
		: undefined}
	tabindex="-1"
	onclick={ev => ev.stopPropagation()}
	ondblclick={ev => ev.stopPropagation()}
	onkeydown={keyHandler}
	use:clickOutside={() => save(true)}
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
		z-index: 3;
	}
	.wx-cell :global(.wx-dropdown) {
		border: var(--wx-table-editor-dropdown-border);
		box-shadow: var(--wx-table-editor-dropdown-shadow);
	}
</style>
