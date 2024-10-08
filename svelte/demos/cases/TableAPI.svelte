<script>
	import { getContext } from "svelte";
	import { Grid } from "../../src";
	import { Button } from "wx-svelte-core";

	import { getData } from "../data";
	const { data, columns } = getData();

	const helpers = getContext("wx-helpers");

	let tbl, selected;
	$: {
		if (tbl) {
			const rState = tbl.getReactiveState();
			selected = rState.selected;

			tbl.intercept("select-row", data => {
				if (data.id == 1) return false;
			});
		}
	}

	function addRow() {
		tbl.exec("add-row", { row: {} });
	}
	function deleteRow() {
		const id = tbl.getState().selected;
		if (id) {
			tbl.exec("delete-row", { id });
		}
	}
	function onSelectRow(ev) {
		helpers.showNotice({ text: ev.detail.id, type: "info" });
	}
</script>

<div style="padding: 20px;">
	<p>
		<Button click={addRow} type="primary">Add row</Button>
		<Button click={deleteRow}>Delete row</Button>
	</p>
	<div style="max-width: 800px;">
		<Grid
			data={data.slice(0, 3)}
			{columns}
			bind:api={tbl}
			on:select-row={onSelectRow}
		/>
	</div>
	<div class="status">Selected: {$selected || "none"}</div>
</div>

<style>
	.status {
		padding: 6px 0;
	}
</style>
