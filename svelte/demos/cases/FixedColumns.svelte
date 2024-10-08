<script>
	import { Field, Slider } from "wx-svelte-core";
	import { Grid } from "../../src";

	import { getData } from "../data";
	const { data, allColumns } = getData();

	let left = 2;
</script>

<div style="padding: 20px;">
	<h4>Drag the slider to fix columns on the left</h4>
	<div class="controls">
		<Field label="Fix columns" let:id>
			<Slider min={0} max={4} bind:value={left} {id} />
		</Field>
	</div>

	<div style="max-width: 800px;">
		<Grid {data} columns={allColumns} split={{ left }} />
	</div>
</div>

<style>
	.controls {
		margin-bottom: 10px;
	}
</style>
