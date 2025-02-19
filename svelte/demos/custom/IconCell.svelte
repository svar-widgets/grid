<script>
	let { row, column, onaction } = $props();

	function onClick() {
		onaction &&
			onaction({
				action: "custom-icon",
				data: {
					column: column.id,
					row: row.id,
				},
			});
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="table_icon" data-action-id={row.id} onclick={onClick}>
	<i class="wxi-dots-h"></i>
</div>

<style>
	.table_icon {
		height: 20px;
		cursor: pointer;
		font-size: 18px;
		text-align: center;
	}
</style>
