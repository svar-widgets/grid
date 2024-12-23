<script>
	import { Cell } from "wx-svelte-grid";
	import StatusStub from "./StatusStub.svelte";
	import { getData } from "../data/index";

	let { row, col, columnStyle, cellStyle } = $props();

	const statuses = getData().statuses;

	let status = $derived(statuses.find(st => st.id === row[col.id]));
</script>

<Cell {row} {col} {columnStyle} {cellStyle}>
	<StatusStub data={status} />
</Cell>
