<script>
	import { Pager } from "@svar-ui/svelte-core";
	import { Grid } from "../../src";

	import { getData } from "../data";
	const { allData, columns } = getData();

	let data = $state([]);
	function setPage(ev) {
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
