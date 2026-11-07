<script lang="ts">
	import { Checkbox } from "@svar-ui/svelte-core";

	import type { ICellProps } from "@svar-ui/svelte-grid";

	let { row, column, onaction, api }: ICellProps = $props();

	function onChange(ev: { value: boolean }) {
		const { value } = ev;

		//execute update action
		api.exec("update-cell", {
			id: row.id,
			column: column.id,
			value,
		});
		//trigger custom event
		onaction?.({
			action: "custom-check",
			data: {
				value,
				column: column.id,
				row: row.id,
			},
		});
	}
</script>

<Checkbox value={row[column.id]} onchange={onChange} />
