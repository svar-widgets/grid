<script>
	import { Button } from "wx-svelte-core";
	import { repeatColumns, repeatData } from "../data";
	import { Grid } from "../../src/";

	function addRow() {
		api.exec("add-row", { row: {} });
	}
	function deleteRow() {
		const id = api.getState().selected;
		if (id) {
			api.exec("delete-row", { id });
		}
	}

	let api;
</script>

<div class="bar">
	<Button click={addRow} type="primary">Add row</Button>
	<Button click={deleteRow}>Delete Row</Button>
</div>
<div class="demo">
	<Grid
		bind:api
		autoRowHeight
		data={repeatData(60)}
		columns={repeatColumns(15).map(c => ({
			...c,
			resize: true,
			editor: "text",
		}))}
		footer={true}
		split={{ left: 2 }}
	/>
</div>

<style>
	.bar {
		height: 50px;
		padding: 12px;
	}
	.demo {
		padding: 20px;
		height: calc(100% - 50px);
	}
</style>
