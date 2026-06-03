<script>
	import { Button } from "@svar-ui/svelte-core";
	import { Grid } from "../../src";
	import { repeatData, repeatColumns } from "../data";

	const data = repeatData(1000);
	const columns = repeatColumns(100);

	let api = $state();
	function doScroll(row, column) {
		api.exec("scroll", { row, column });
	}
	function doScrollTo(top, left) {
		api.exec("scroll-to", { top, left });
	}
</script>

<div style="padding: 20px;">
	<div
		style="padding-bottom: 20px; display:flex; flex-direction: columns; gap: 20px;"
	>
		<Button type="primary" onclick={() => doScroll(data[999].id)}>
			Scroll to the last row
		</Button>
		<Button type="primary" onclick={() => doScroll(null, columns[99].id)}>
			Scroll to the last column
		</Button>
		<Button
			type="primary"
			onclick={() => doScroll(data[0].id, columns[1].id)}
		>
			Scroll to the first row and column
		</Button>
	</div>
	<div
		style="padding-bottom: 20px; display:flex; flex-direction: columns; gap: 20px;"
	>
		<Button type="primary" onclick={() => doScrollTo(5000, 0)}>
			Scroll to top: 5000
		</Button>
		<Button type="primary" onclick={() => doScrollTo(0, 2000)}>
			Scroll to left: 2000
		</Button>
		<Button type="primary" onclick={() => doScrollTo(0, 0)}>
			Scroll to top-left corner
		</Button>
	</div>
	<div style="width: 1000px; height: 600px;">
		<Grid bind:this={api} {data} {columns} split={{ left: 1 }} />
	</div>
</div>
