<script>
	import { Text } from "@svar-ui/svelte-core";

	let { filter, column, action, filterValue } = $props();

	function filterRows({ value }) {
		action({ value, key: column.id });
	}
</script>

<Text {...filter.config ?? {}} value={filterValue} onchange={filterRows} />

<style>
	:global(.wx-print-filter),
	:global(.wx-cell.wx-filter > .wx-text > input) {
		height: 28px;
		padding: 4px 8px;
	}

	:global(.wx-print-filter) {
		border: var(--wx-table-border);
		background: var(--wx-background);
		border-radius: var(--wx-input-border-radius);
		font-weight: 400;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
