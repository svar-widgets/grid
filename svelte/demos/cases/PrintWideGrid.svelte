<script>
	import { Grid } from "../../src";
	import { Button, Field, RadioButtonGroup } from "wx-svelte-core";
	import { repeatData, repeatColumns } from "../data";

	const data = repeatData(100);
	const columns = repeatColumns(20);

	let mode = $state("portrait");
	let paper = $state("a4");

	const modes = [
		{ id: "portrait", label: "Portrait" },
		{ id: "landscape", label: "Landscape" },
	];
	const papers = [
		{ id: "a3", label: "a3" },
		{ id: "a4", label: "a4" },
		{ id: "letter", label: "letter" },
	];

	let api = $state();

	function printGrid() {
		api.exec("print", { mode, paper });
	}
</script>

<div class="demo" style="padding: 20px;">
	<div class="config">
		<Field label="Mode" position="left" type="checkbox">
			<RadioButtonGroup options={modes} type="inline" bind:value={mode} />
		</Field>
		<Field label="Paper" position="left" type="checkbox">
			<RadioButtonGroup
				options={papers}
				type="inline"
				bind:value={paper}
			/>
		</Field>
	</div>
	<h4>Print grid</h4>
	<div>
		<Button onclick={printGrid} type={"primary"}>Print Grid</Button>
	</div>
	<div style="height: 400px; margin-top: 10px;">
		<Grid bind:this={api} {data} {columns} />
	</div>
</div>

<style>
	.config {
		display: flex;
	}
	.config :global(.wx-field) {
		width: fit-content;
	}
</style>
