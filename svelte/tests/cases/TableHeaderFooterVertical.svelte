<script>
	import { Grid } from "../../src";
	import { getData } from "../data";
	import { Material, Locale } from "wx-svelte-core";

	const {
		allData: data,
		columnsVertical: columns,
		columnsSpansVertical: scolumns,
	} = getData();
</script>

<Material>
	<Locale>
		<div class="demo">
			<Grid {data} {columns} footer={true} />
		</div>
		<div class="demo">
			<Grid {data} columns={scolumns} footer={true} />
		</div>
	</Locale>
</Material>

<style>
	.demo {
		--wx-table-header-cell-border: var(--wx-table-cell-border);
		--wx-table-footer-cell-border: var(--wx-table-cell-border);

		padding: 20px;
		height: 50%;
	}
</style>
