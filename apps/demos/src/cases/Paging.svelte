<script lang="ts">
	import { Pager } from "@svar-ui/svelte-core";
	import { Grid, type IRow } from "@svar-ui/svelte-grid";

	import { getData } from "../data";
	const { allData, columns } = getData();

	let data = $state<IRow[]>([]);
	function setPage(ev: { from: number; to: number }) {
		const { from, to } = ev;
		data = allData.slice(from, to);
	}
	setPage({ from: 0, to: 8 });
</script>

<div style="padding: 20px;">
	<Pager total={allData.length} pageSize={8} onchange={setPage} />
	<div>
		<Grid {data} {columns} />
	</div>
</div>
