<script>
	import StatusStub from "./StatusStub.svelte";
	import { getData } from "../data/index";

	let { row, column } = $props();

	const statuses = getData().statuses;

	let status = $derived(statuses.find(st => st.id === row[column.id]));
</script>

<StatusStub data={status} />
