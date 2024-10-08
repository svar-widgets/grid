<script>
	import { Button } from "wx-svelte-core";
	import { Grid } from "../../src";
	import { repeatData, repeatColumns } from "../data";

	const data = repeatData(1000);
	const columns = repeatColumns(100);

	let api;
	function doScroll(row, column) {
		api.exec("scroll", { row, column });
	}
</script>

<div style="padding: 20px;">
	<div
		style="padding-bottom: 20px; display:flex; flex-direction: columns; gap: 20px;"
	>
		<Button type="primary" click={() => doScroll(data[999].id)}>
			Scroll to the last row
		</Button>
		<Button type="primary" click={() => doScroll(null, columns[99].id)}>
			Scroll to the last column
		</Button>
		<Button
			type="primary"
			click={() => doScroll(data[0].id, columns[1].id)}
		>
			Scroll to the first row and column
		</Button>
	</div>
	<div style="width: 1000px; height: 600px;">
		<Grid bind:api {data} {columns} split={{ left: 1 }} />
	</div>
</div>
