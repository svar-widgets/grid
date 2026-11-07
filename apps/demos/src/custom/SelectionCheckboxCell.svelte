<script lang="ts">
	import { Checkbox } from "@svar-ui/svelte-core";

	import type { ICellProps } from "@svar-ui/svelte-grid";

	let { row, api }: ICellProps = $props();

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
	<Checkbox onchange={onChange} />
</div>
