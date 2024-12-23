<script>
	import { Slider, Field, Checkbox } from "wx-svelte-core";
	import { Grid } from "../../src";

	import { getData, repeatColumns } from "../data";
	const { data, columns, flexibleColumns } = getData();

	let w = $state(600);
	let h = $state(320);
	let psize = $state(false);
</script>

<div style="padding: 20px;">
	<h4>DataGrid adjusts to the container</h4>
	<Field>
		<Checkbox label="Fill screen" bind:value={psize} />
	</Field>
	<div class="controls">
		{#if !psize}
			<Slider
				label="Container width: {w}px"
				min={200}
				max={800}
				bind:value={w}
			/>
			<Slider
				label="Container height: {h}px"
				min={200}
				max={800}
				bind:value={h}
			/>
		{/if}
	</div>

	<h3>Columns with fixed widths</h3>
	<div
		class="container"
		style={psize
			? "width:100%; height: 50%;"
			: `width:${w}px;height:${h}px`}
	>
		<Grid data={data.slice(0, 15)} {columns} />
	</div>

	<h3>Columns with flexible widths</h3>
	<div
		class="container"
		style={psize
			? "width:100%; height: 50%;"
			: `width:${w}px;height:${h}px`}
	>
		<Grid data={data.slice(0, 15)} columns={flexibleColumns} />
	</div>

	<h3>A lot of columns</h3>
	<div
		class="container"
		style={psize
			? "width:100%; height: 50%;"
			: `width:${w}px;height:${h}px`}
	>
		<Grid data={data.slice(0, 15)} columns={repeatColumns(50)} />
	</div>
</div>

<style>
	.controls {
		display: flex;
		gap: 20px;
		width: 700px;
		margin-bottom: 20px;
	}
	.container {
		width: 1200px;
		height: 800px;
		background-color: #e7dcf7;
		padding: 10px;
		margin-bottom: 30px;
	}
</style>
