<script>
	import { getData } from "../data";
	import { Grid } from "../../src/";

	const { data, columns } = getData();
</script>

<div style="padding: 20px;">
	<div>
		<Grid {data} {columns} />
	</div>
</div>
