<script lang="ts">
	import StatusStub from "./StatusStub.svelte";
	import { getData } from "../data/index";

	import type { ICellProps } from "@svar-ui/svelte-grid";

	let { row, column }: ICellProps = $props();

	const statuses = getData().statuses;

	let status = $derived(statuses.find(st => st.id === row[column.id]));
</script>

<StatusStub data={status!} />
