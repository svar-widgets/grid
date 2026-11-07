<script lang="ts">
	import { Checkbox } from "@svar-ui/svelte-core";
	import type { ICellProps, IRow } from "@svar-ui/svelte-grid";

	let { row, api }: ICellProps = $props();

	// the grid passes the same api for the whole life of the cell
	// svelte-ignore state_referenced_locally
	const { selectedRows, data } = api.getReactiveState();

	let parentData = $state<IRow | null>();
	$effect(() => {
		if (parentData && $selectedRows!.length) {
			const everyChildSelected = parentData.data.every(
				(d: IRow) => $selectedRows!.indexOf(d.id) !== -1
			);
			api.exec("select-row", {
				id: parentData.id,
				mode: everyChildSelected,
				toggle: true,
			});
			parentData = null;
		}
	});

	function onChange(ev: { value: boolean }) {
		const { value } = ev;
		const parent = row.$parent;

		api.exec("select-row", {
			id: row.id,
			mode: value,
			toggle: true,
		});

		if (parent !== 0) {
			parentData = $data.find(el => el.id === parent);
		}

		row.data?.forEach((d: IRow) => {
			api.exec("select-row", {
				id: d.id,
				mode: value,
				toggle: true,
			});
		});
	}
</script>

<div data-action="ignore-click">
	<Checkbox
		onchange={onChange}
		value={$selectedRows!.indexOf(row.id) !== -1}
	/>
</div>
