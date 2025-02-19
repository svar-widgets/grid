<script>
	import EditorSelectCell from "./EditorSelectCell.svelte";

	let { row, column } = $props();

	let data = $derived.by(() => {
		const options = column.options;
		return options?.find(o => o.id == row[column.id]);
	});
</script>

<EditorSelectCell {data} />
