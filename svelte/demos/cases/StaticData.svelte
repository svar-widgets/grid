<script>
	import { tick } from "svelte";

	import { Slider, Button } from "wx-svelte-core";
	import { Grid } from "../../src";
	import { repeatData, repeatColumns } from "../data";
	import { timer, timerEnd } from "../custom/timers";

	let data = $state([]);
	let columns = $state([]);

	let stats = $state(null);
	let counter = $state(1);
	let rows = $state(1000);
	let cols = $state(100);

	function genAndLoad() {
		timer("gen");
		stats = null;
		data = repeatData(+rows);
		columns = repeatColumns(+cols);
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
</script>

<div style="padding: 20px;">
	<h4>Load and render big data at once</h4>
	<div style="width: 320px; padding-bottom: 20px;">
		<Slider label="Rows: {rows}" min={2} max={200000} bind:value={rows} />
	</div>
	<div style="width: 320px; padding-bottom: 20px;">
		<Slider label="Columns: {cols}" min={2} max={20000} bind:value={cols} />
	</div>
	<div style="width: 320px; padding-bottom: 20px;">
		<Button type="primary" onclick={genAndLoad}>
			Generate data and load
		</Button>
	</div>
	<div style="width: 1000px; height: 600px;">
		{#key counter}
			<Grid {data} {columns} split={{ left: 1 }} />
		{/key}
	</div>
	{#if stats}
		<pre>
{rows} rows, {cols} columns, {rows * cols} cells
dataset generation: {stats.gen}ms
dataset rendering: {stats.render}ms</pre>
	{/if}
</div>
