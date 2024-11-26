<script>
	import { Field, Slider, Material, Locale } from "wx-svelte-core";
	import { Grid } from "../../src";

	import { getData } from "../data";
	const { allData: data, allColumns } = getData();

	let left = $state(2);

	const columns = allColumns.map(c => {
		if (c.id !== "id") c.editor = "text";
		return c;
	});
</script>

<Material>
	<Locale>
		<div style="padding: 20px;">
			<h4>Table with fixed / resizable columns</h4>
			<div class="controls">
				<Field label="Fix columns">
					{#snippet children({ id })}
						<Slider min={0} max={4} bind:value={left} {id} />
					{/snippet}
				</Field>
			</div>

			<div style="height: 415px; max-width: 800px;">
				<Grid {data} {columns} split={{ left }} />
			</div>
		</div>
	</Locale>
</Material>

<style>
	.controls {
		margin-bottom: 10px;
	}
</style>
