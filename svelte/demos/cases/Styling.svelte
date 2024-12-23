<script>
	import { getData, repeatColumns } from "../data";
	import { Button } from "wx-svelte-core";
	import { Grid } from "../../src/";

	const { data } = getData();
	const columns = repeatColumns(50);

	let cellStyle = $state();
	let i = 0;
	function setCellStyle() {
		let id = data[i].id;
		cellStyle = (row, col) =>
			row.id == id && col.id == "lastName" ? "cellStyle" : "";
		i = i == data.length - 1 ? 0 : i + 1;
	}
</script>

<div style="padding: 20px;">
	<p>
		<Button type="primary" onclick={() => setCellStyle()}
			>Set cell style</Button
		>
	</p>
	<div>
		<Grid
			{data}
			{columns}
			{cellStyle}
			rowStyle={row => (row.id == 12 ? "rowStyle" : "")}
			columnStyle={col => (col.id == "city" ? "columnStyle" : "")}
			footer={true}
		/>
	</div>
</div>

<style>
	:global(.rowStyle:not(.wx-selected) .wx-cell:not(.cellStyle)) {
		color: white;
		background: #457b9d;
	}
	:global(.columnStyle) {
		text-decoration: underline;
	}
	:global(.wx-row:not(.wx-selected) .cellStyle) {
		color: white;
		background: rgba(82, 179, 163, 0.8);
	}
</style>
