<script>
	import { Pager } from "wx-svelte-core";
	import { Grid } from "../../src";

	import { getData } from "../data";
	const { allData, columns } = getData();

	let data = [];
	function setPage(ev) {
		const { from, to } = ev.detail;
		data = allData.slice(from, to);
	}
</script>

<div style="padding: 20px;">
	<Pager total={allData.length} pageSize={8} on:change={setPage} />
	<div>
		<Grid {data} {columns} />
	</div>
</div>
