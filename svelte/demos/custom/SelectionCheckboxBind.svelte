<script>
	import { Checkbox } from "@svar-ui/svelte-core";

	let { row, api } = $props();

	const selectedRows = api.getReactiveState().selectedRows;

	function onChange(ev) {
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
		value={$selectedRows.indexOf(row.id) !== -1}
	/>
</div>
