<script>
	import { getData } from "../data";
	import { Grid } from "../../src";

	const { data, allData, collapsibleColumns } = getData();
</script>

<div class="demo" style="padding: 20px;">
	<div style="height: 510px;">
		<Grid data={allData} columns={collapsibleColumns()} footer={true} />
	</div>
</div>

<div class="demo" style="padding: 20px;">
	<div>
		<Grid {data} columns={collapsibleColumns("first")} />
	</div>
</div>
