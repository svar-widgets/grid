<script lang="ts">
	import { getContext } from "svelte";
	import { getStyle } from "../../helpers/columnWidth";
	import { editors } from "./editors";
	import { getValue } from "@svar-ui/grid-store";
	import { isSame } from "@svar-ui/lib-state";
	import type { TID } from "@svar-ui/lib-state";
	import type { IRenderColumn, IRow } from "@svar-ui/grid-store";
	import type { ICellAction, IInnerApi } from "../../types";

	type Props = {
		column: IRenderColumn;
		row: IRow;
	};

	let { column, row }: Props = $props();

	const api = getContext<IInnerApi>("grid-store");
	const { editor } = api.getReactiveState();

	type TFocusCell = { row: TID; column: TID } | null;

	// ignoreFocus can be a flag or the click event that closed the editor
	function save(ignoreFocus?: unknown) {
		const cell = getCell(ignoreFocus);
		const isSameValue = isSame(getValue(row, column), $editor!.value);
		closeEditor(isSameValue, cell);
	}

	function cancel(ignoreFocus?: unknown) {
		const cell = getCell(ignoreFocus);
		closeEditor(true, cell);
	}

	function updateValue(value: any) {
		api.exec("editor", { value });
	}

	function closeEditor(ignore: boolean, cell: TFocusCell) {
		api.exec("close-editor", { ignore });
		if (cell) {
			api.exec("focus-cell", {
				...cell,
				eventSource: "click",
			});
		}
	}

	function getCell(ignoreFocus: unknown): TFocusCell {
		return ignoreFocus
			? null
			: { row: $editor!.id, column: $editor!.column };
	}

	function keyHandler(ev: KeyboardEvent) {
		if (ev.key === "Enter" && $editor) {
			if (column.editor!.type === "multiselect") {
				updateValue($editor.value);
			} else {
				cancel();
			}
		}
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
		// a string, an editor config, or a function that returns one of them
		let editor: any = column.editor;
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
>
	<SvelteComponent
		editor={$editor}
		onsave={save}
		onapply={updateValue}
		oncancel={cancel}
		onaction={({ action, data }: ICellAction) => api.exec(action, data)}
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
