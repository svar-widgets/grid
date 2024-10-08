<script>
	import { getData } from "../data";
	import { Grid } from "../../src";

	const { allData } = getData();
	const config = { editor: "text" };
</script>

<div style="padding: 20px;">
	<div style="height: 620px; max-width: 800px;">
		<Grid data={allData} autoConfig={config} />
	</div>
</div>
