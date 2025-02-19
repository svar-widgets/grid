<script>
	import { Grid } from "../../src";
	import { repeatData, repeatColumns } from "../data";

	const rows = 100;
	const cols = 20;

	const data = repeatData(rows, cols);
	const columns = repeatColumns(cols);
	const columnsWithDraggable = repeatColumns(cols);
	const columnsWithSelectiveDraggable = repeatColumns(cols);

	columnsWithDraggable[0].draggable = true;
	columnsWithSelectiveDraggable[0].draggable = row => row.id % 2 === 1;
</script>

<div style="padding: 20px;">
	<h4>Base reordering</h4>
	<div style="width: 800px; height: 400px;">
		<Grid {data} {columns} reorder />
	</div>
</div>

<div style="padding: 20px;">
	<h4>Reordering with a drag handle</h4>
	<div style="width: 800px; height: 400px;">
		<Grid {data} columns={columnsWithDraggable} footer reorder />
	</div>
</div>

<div style="padding: 20px;">
	<h4>
		Restrictive drag handlers (rows without drag handlers cannot be moved)
	</h4>
	<div style="width: 800px; height: 400px;">
		<Grid {data} columns={columnsWithSelectiveDraggable} footer reorder />
	</div>
</div>
