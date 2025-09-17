<script>
	import { Checkbox } from "@svar-ui/svelte-core";

	let { row, api } = $props();

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
	<Checkbox onchange={onChange} />
</div>
