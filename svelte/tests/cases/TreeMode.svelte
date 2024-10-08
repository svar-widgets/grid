<script>
	import { Grid } from "../../src";
	import { getData } from "../data";
	import { Material, Locale } from "wx-svelte-core";

	const { treeData, treeColumns } = getData();
</script>

<Material>
	<Locale>
		<div style="padding: 20px; width: 960px;">
			<Grid tree data={treeData} columns={treeColumns} />
		</div>
	</Locale>
</Material>
