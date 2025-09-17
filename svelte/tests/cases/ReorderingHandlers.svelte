<script>
	import { Grid } from "../../src";
	import { Willow, Locale } from "@svar-ui/svelte-core";
	import { repeatData, repeatColumns } from "../data";

	const rows = 100;
	const cols = 20;

	const data = repeatData(rows, cols);
	const columns = repeatColumns(cols);
	columns[0].draggable = row => row.id % 2 === 1;
</script>

<Willow>
	<Locale>
		<div style="padding: 20px;">
			<div style="width: 800px; height: 400px;">
				<Grid {data} {columns} reorder />
			</div>
		</div>
	</Locale>
</Willow>
