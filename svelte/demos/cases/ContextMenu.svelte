<script>
	import { getData } from "../data";
	import { Grid, ContextMenu, HeaderMenu } from "../../src/";

	const { data, flexibleColumns: columns } = getData();
	let grid = $state();
</script>

<div style="padding: 20px;">
	<h4>Context menu with default actions</h4>
	<ContextMenu api={grid}>
		<HeaderMenu api={grid}>
			<Grid {data} {columns} bind:this={grid} multiselect reorder />
		</HeaderMenu>
	</ContextMenu>
</div>
