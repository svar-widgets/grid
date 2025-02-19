<script>
	import { Checkbox } from "wx-svelte-core";

	let { row, column, onaction, api } = $props();

	function onChange(ev) {
		const { value } = ev;

		//execute update action
		api.exec("update-cell", {
			id: row.id,
			column: column.id,
			value,
		});
		//trigger custom event
		onaction &&
			onaction({
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
