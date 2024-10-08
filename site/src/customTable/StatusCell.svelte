<script>
	import { Cell } from "wx-svelte-grid";
	import StatusStub from "./StatusStub.svelte";
	import { getData } from "./data";

	export let row;
	export let col;
	export let columnStyle;
	export let cellStyle;

	const statuses = getData().statuses;

	$: status = statuses.find(st => st.id === row[col.id]);
</script>

<Cell {row} {col} {columnStyle} {cellStyle}>
	<StatusStub data={status} />
</Cell>
