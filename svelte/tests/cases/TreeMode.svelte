<script>
	import { Grid } from "../../src";
	import { getData } from "../data";
	import { Willow, Locale } from "@svar-ui/svelte-core";

	const { treeData, treeColumns } = getData();
</script>

<Willow>
	<Locale>
		<div style="padding: 20px; width: 960px;">
			<Grid tree data={treeData} columns={treeColumns} />
		</div>
	</Locale>
</Willow>
