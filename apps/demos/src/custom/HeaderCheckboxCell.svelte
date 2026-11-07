<script lang="ts">
	import { Checkbox } from "@svar-ui/svelte-core";

	import type { IHeaderCellProps, IRow } from "@svar-ui/svelte-grid";

	let { api, onaction }: IHeaderCellProps = $props();
	let value = $state(false);

	// svelte-ignore state_referenced_locally
	api.getReactiveState().data.subscribe((data: IRow[]) => onCellCheck(data));

	function onCellCheck(data: IRow[]) {
		if (!data) ({ data } = api.getState());
		const checked = data.every(d => d.checked === true);

		if (value !== checked) {
			onaction?.({
				action: "custom-header-check",
				data: { value: checked },
			});

			value = checked;
		}
	}

	function onChange(ev: { value: boolean }) {
		const { value } = ev;
		onaction?.({
			action: "custom-header-check",
			data: { value, eventSource: "click" },
		});
	}
</script>

<Checkbox bind:value onchange={onChange} />
