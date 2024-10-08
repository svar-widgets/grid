<script>
	import { getData } from "../data";
	import { Grid, ContextMenu, HeaderMenu } from "../../src/";

	const { data, flexibleColumns: columns } = getData();
	let api;
</script>

<div style="padding: 20px;">
	<h4>Context menu with default actions</h4>
	<ContextMenu {api}>
		<HeaderMenu {api}>
			<Grid {data} {columns} bind:api />
		</HeaderMenu>
	</ContextMenu>
</div>
