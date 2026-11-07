<script lang="ts">
	import EditorSelectCell from "./EditorSelectCell.svelte";

	import type { ICellProps } from "@svar-ui/svelte-grid";

	let { row, column }: ICellProps = $props();

	let data = $derived.by(() => {
		const options = column.options;
		return options?.find(o => o.id == row[column.id!]);
	});
</script>

<EditorSelectCell {data} />
