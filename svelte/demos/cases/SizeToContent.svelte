<script>
	import { Grid } from "../../src";

	import { getData } from "../data";
	const { data, allColumns } = getData();
</script>

<div style="padding: 20px;">
	<h4>DataGrid adjusts to the content ( 1 row )</h4>
	<Grid data={data.slice(0, 1)} columns={allColumns.slice(0, 3)} />
</div>

<div style="padding: 20px;">
	<h4>DataGrid adjusts to the content ( 1 row, flexible column widths )</h4>
	<Grid
		data={data.slice(0, 1)}
		header={false}
		columns={[
			{ id: "id", width: 40 },
			{ id: "city", flexgrow: 1 },
			{ id: "email", flexgrow: 1 },
		]}
	/>
</div>

<div style="padding: 20px;">
	<h4>DataGrid adjusts to the content ( 10 rows )</h4>
	<Grid data={data.slice(0, 10)} columns={allColumns.slice(0, 5)} />
</div>

<div style="padding: 20px;">
	<h4>DataGrid adjusts to the content ( multiple rows )</h4>
	<Grid {data} columns={allColumns} />
</div>
