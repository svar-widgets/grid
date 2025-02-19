<script>
	import { Checkbox } from "wx-svelte-core";

	let { api, onaction } = $props();
	let value = $state(false);

	api.getReactiveState().data.subscribe(data => onCellCheck(data));

	function onCellCheck(data) {
		if (!data) ({ data } = api.getState());
		const checked = data.every(d => d.checked === true);

		if (value !== checked) {
			onaction &&
				onaction({
					action: "custom-header-check",
					data: { value: checked },
				});

			value = checked;
		}
	}

	function onChange(ev) {
		const { value } = ev;
		onaction &&
			onaction({
				action: "custom-header-check",
				data: { value, eventSource: "click" },
			});
	}
</script>

<Checkbox bind:value onchange={onChange} />
