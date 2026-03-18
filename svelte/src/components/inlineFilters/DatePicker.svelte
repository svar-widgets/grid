<script>
	import { DatePicker } from "@svar-ui/svelte-core";

	let { filter, column, action, filterValue } = $props();

	function filterRows({ value }) {
		action({ value, key: column.id });
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style="width:100%;">
	<DatePicker
		placeholder={""}
		clear={true}
		{...filter.config ?? {}}
		value={filterValue}
		onchange={filterRows}
	/>
</div>

<style>
	:global(.wx-cell.wx-filter div.wx-datepicker input) {
		height: 28px;
		padding: 4px 8px;
	}
</style>
