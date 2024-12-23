<script>
	import { Checkbox } from "wx-svelte-core";
	import { Cell } from "wx-svelte-grid";

	let { row, col, columnStyle, cellStyle, api } = $props();

	const { selectedRows, data } = api.getReactiveState();

	let parentData = $state();
	$effect(() => {
		if (parentData) {
			const everyChildSelected = parentData.data.every(
				d => $selectedRows.indexOf(d.id) !== -1
			);
			api.exec("select-row", {
				id: parentData.id,
				mode: everyChildSelected,
				toggle: true,
			});
			parentData = null;
		}
	});

	function onChange(ev) {
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

		row.data?.forEach(d => {
			api.exec("select-row", {
				id: d.id,
				mode: value,
				toggle: true,
			});
		});
	}
</script>

<Cell {row} {col} {columnStyle} {cellStyle}>
	<div data-action="ignore-click">
		<Checkbox
			onchange={onChange}
			value={$selectedRows.indexOf(row.id) !== -1}
		/>
	</div>
</Cell>
