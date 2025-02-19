<script>
	import { tick } from "svelte";

	import { Slider, Button } from "wx-svelte-core";
	import { Grid } from "../../src";
	import { repeatData, repeatColumns } from "../data";
	import { timer, timerEnd } from "../custom/timers";

	import { getContext } from "svelte";
	const helpers = getContext("wx-helpers");

	let data = $state([]);
	let rawData = [];
	let columns = $state([]);

	let stats = $state(null);
	let counter = $state(1);
	let rowCount = $state(1000);
	let columnCount = $state(100);
	let requestRange = $state({ start: 0, end: 0 });

	function genAndLoad() {
		timer("gen");
		stats = null;
		rawData = repeatData(+rowCount);
		columns = repeatColumns(+columnCount);
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
		const { row } = ev;

		if (row.start)
			//mute notice for 1st request for testing purposes
			helpers.showNotice({
				text: `Request data: ${row.start} - ${row.end}`,
			});
		if (row) {
			data = rawData.slice(row.start, row.end);
			requestRange = row;
		}
	}

	function init(api) {
		api.on("move-item", ev => {
			const { id, target, mode } = ev;
			const index = rawData.findIndex(el => el.id === id);
			const targetIndex = rawData.findIndex(el => el.id === target);
			rawData.splice(
				mode === "before" ? targetIndex : targetIndex + 1,
				0,
				rawData.splice(index, 1)[0]
			);

			if (data.findIndex(el => el.id === id) === -1) {
				// update visible range in case the item is not present there
				data = rawData.slice(requestRange.start, requestRange.end);
			}
		});
	}
</script>

<div style="padding: 20px;">
	<h4>Load data in portions during scroll</h4>

	<div style="width: 320px; padding-bottom: 20px;">
		<Slider
			label="Rows: {rowCount}"
			min={2}
			max={200000}
			bind:value={rowCount}
		/>
	</div>
	<div style="width: 320px; padding-bottom: 20px;">
		<Slider
			label="Columns: {columnCount}"
			min={2}
			max={20000}
			bind:value={columnCount}
		/>
	</div>
	<div style="width: 320px; padding-bottom: 20px;">
		<Button type="primary" onclick={genAndLoad}>
			Generate data and load
		</Button>
	</div>
	<div style="width: 1000px; height: 600px;">
		{#key counter}
			<Grid
				{init}
				{data}
				{columns}
				dynamic={{ rowCount, columnCount }}
				onrequestdata={dataProvider}
				reorder
			/>
		{/key}
	</div>
	{#if stats}
		<pre>
{rowCount} rows, {columnCount} columns, {rowCount * columnCount} cells
dataset generation: {stats.gen}ms
dataset rendering: {stats.render}ms</pre>
	{/if}
</div>
