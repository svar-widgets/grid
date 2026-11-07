<script lang="ts">
	import { DatePicker as CoreDatePicker } from "@svar-ui/svelte-core";
	import type { IInlineFilterProps } from "../../types";

	let { filter, column, action, filterValue }: IInlineFilterProps = $props();

	function filterRows({ value }: { value: any }) {
		action({ value, key: column.id });
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style="width:100%;">
	<CoreDatePicker
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
