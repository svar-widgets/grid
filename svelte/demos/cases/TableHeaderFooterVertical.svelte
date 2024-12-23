<script>
	import { getData } from "../data";
	import { Grid } from "../../src";

	const {
		data,
		columnsVertical: columns,
		columnsSpansVertical: scolumns,
	} = $state(getData());
	data.length = 5;
</script>

<div class="demo" style="padding: 20px;">
	<div>
		<Grid {data} {columns} footer={true} />
	</div>
	<div style="margin-top: 20px;">
		<Grid {data} columns={scolumns} footer={true} />
	</div>
</div>

<style>
	.demo :global(.footer) {
		border-bottom: none;
	}

	.demo :global(.wx-right) {
		justify-content: right;
	}
</style>
