<script>
	import { Grid } from "../../src";
	import { Willow, Locale } from "wx-svelte-core";
	import { repeatData, repeatColumns } from "../data";

	const rows = 100;
	const cols = 20;

	const data = repeatData(rows, cols);
	const columns = repeatColumns(cols);
</script>

<Willow>
	<Locale>
		<div style="padding: 20px;">
			<div style="width: 800px; height: 500px;">
				<Grid {data} {columns} reorder />
			</div>
		</div>
	</Locale>
</Willow>
