<script>
	let { row, column } = $props();
	const value = $derived(row[column.id]);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if value}
	<div class="color_block" style="background-color:{value}">
		<span>{value}</span>
	</div>
{/if}

<style>
	.color_block {
		height: 20px;
		width: 20px;
		border-radius: 3px;
		border: var(--wx-table-cell-border);
	}
	span {
		padding-left: 26px;
	}
</style>
