<script lang="ts">
	import { Checkbox } from "@svar-ui/svelte-core";

	import type { ICellProps } from "@svar-ui/svelte-grid";

	let { row, api }: ICellProps = $props();

	// svelte-ignore state_referenced_locally
	const selectedRows = api.getReactiveState().selectedRows;

	function onChange(ev: { value: boolean }) {
		const { value } = ev;

		api.exec("select-row", {
			id: row.id,
			mode: value,
			toggle: true,
		});
	}
</script>

<div data-action="ignore-click">
	<Checkbox
		onchange={onChange}
		value={$selectedRows!.indexOf(row.id) !== -1}
	/>
</div>
