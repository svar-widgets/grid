<script>
	import { Button } from "@svar-ui/svelte-core";
	import { repeatColumns, repeatData } from "../data";
	import { Grid } from "../../src/";

	function addRow() {
		api.exec("add-row", { row: {} });
	}
	function deleteRow() {
		const id = api.getState().selectedRows[0];
		if (id) {
			api.exec("delete-row", { id });
		}
	}

	let api = $state();
</script>

<div class="bar">
	<Button onclick={addRow} type="primary">Add row</Button>
	<Button onclick={deleteRow}>Delete Row</Button>
</div>
<div class="demo">
	<Grid
		bind:this={api}
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
