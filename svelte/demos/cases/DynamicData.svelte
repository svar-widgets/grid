<script>
	import { tick } from "svelte";

	import { Slider, Button } from "wx-svelte-core";
	import { Grid } from "../../src";
	import { repeatData, repeatColumns } from "../data";
	import { timer, timerEnd } from "../custom/timers";

	import { getContext } from "svelte";
	const helpers = getContext("wx-helpers");

	let data = [];
	let rawData = [];
	let columns = [];

	let stats = null;
	let counter = 1;
	let rowsCount = 1000;
	let colsCount = 100;

	function genAndLoad() {
		timer("gen");
		stats = null;
		rawData = repeatData(+rowsCount);
		columns = repeatColumns(+colsCount);
		counter += 1;
		const gen = timerEnd("gen");

		timer("render");
		tick().then(() => {
			setTimeout(() => {
				const render = timerEnd("render");
				const full = gen + render;
				stats = { gen, render, full };
			}, 1);
		});
	}

	genAndLoad();

	function dataProvider(ev) {
		const { requestData } = ev.detail;
		const { row } = requestData;

		helpers.showNotice({ text: `Request data: ${row.start} - ${row.end}` });
		if (row) data = rawData.slice(row.start, row.end);
	}
</script>

<div style="padding: 20px;">
	<h4>Load data in portions during scroll</h4>

	<div style="width: 320px; padding-bottom: 20px;">
		<Slider
			label="Rows: {rowsCount}"
			min={2}
			max={200000}
			bind:value={rowsCount}
		/>
	</div>
	<div style="width: 320px; padding-bottom: 20px;">
		<Slider
			label="Columns: {colsCount}"
			min={2}
			max={20000}
			bind:value={colsCount}
		/>
	</div>
	<div style="width: 320px; padding-bottom: 20px;">
		<Button type="primary" click={genAndLoad}>
			Generate data and load
		</Button>
	</div>
	<div style="width: 1000px; height: 600px;">
		{#key counter}
			<Grid
				{data}
				{columns}
				dynamic={{ rowsCount, colsCount }}
				on:data-request={dataProvider}
			/>
		{/key}
	</div>
	{#if stats}
		<pre>
{rowsCount} rows, {colsCount} columns, {rowsCount * colsCount} cells
dataset generation: {stats.gen}ms
dataset rendering: {stats.render}ms</pre>
	{/if}
</div>
