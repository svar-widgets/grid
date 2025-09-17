<script>
	import { Button } from "@svar-ui/svelte-core";
	import { getData } from "../data";
	import { Grid } from "../../src/";

	const { treeData, treeColumns } = getData();

	let api = $state();

	function openAll() {
		api.exec("open-row", { id: 0, nested: true });
	}

	function closeAll() {
		api.exec("close-row", { id: 0, nested: true });
	}
</script>

<div style="padding: 20px;">
	<div class="toolbar">
		<Button type="primary" onclick={() => openAll()}>Open all</Button>
		<Button type="primary" onclick={() => closeAll()}>Close all</Button>
	</div>
	<div>
		<Grid
			bind:this={api}
			tree={true}
			data={treeData}
			columns={treeColumns}
			footer={true}
		/>
	</div>
</div>

<style>
	.toolbar {
		margin-bottom: 10px;
	}
</style>
