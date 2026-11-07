<script lang="ts">
	import { Text as CoreText } from "@svar-ui/svelte-core";
	import type { IInlineFilterProps } from "../../types";

	let { filter, column, action, filterValue }: IInlineFilterProps = $props();

	function filterRows({ value }: { value: any }) {
		action({ value, key: column.id });
	}
</script>

<CoreText {...filter.config ?? {}} value={filterValue} onchange={filterRows} />

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
