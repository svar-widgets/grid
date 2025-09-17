<script>
	import { Field, Slider } from "@svar-ui/svelte-core";
	import { Grid } from "../../src";

	import { getData } from "../data";
	const { data, allColumns } = getData();

	let left = $state(2);
</script>

<div style="padding: 20px;">
	<h4>Drag the slider to fix columns on the left</h4>
	<div class="controls">
		<Field label="Fix columns">
			{#snippet children({ id })}
				<Slider min={0} max={4} bind:value={left} {id} />
			{/snippet}
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
