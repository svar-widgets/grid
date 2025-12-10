<script>
	import { Button } from "@svar-ui/svelte-core";
	import { Grid } from "../../src/";
	import { repeatData, getData } from "../data";

	const { columns } = getData();

	const data = repeatData(50).map((row, i) => {
		const hcase = i % 10;

		if (hcase === 2) return { ...row, rowHeight: 50 };
		if (hcase === 5) return { ...row, rowHeight: 75 };
		if (hcase === 7) return { ...row, rowHeight: 100 };
		return row;
	});

	let api = $state();
	function doScroll(row) {
		api.exec("scroll", { row });
	}
</script>

<div style="padding: 20px;">
	<h4>DataGrid can have custom row heights</h4>
	<div
		style="padding-bottom: 20px; display:flex; flex-direction: columns; gap: 20px;"
	>
		<Button type="primary" onclick={() => doScroll(data[49].id)}>
			Scroll: last row
		</Button>
		<Button type="primary" onclick={() => doScroll(data[0].id)}>
			Scroll: first row
		</Button>
		<Button type="primary" onclick={() => doScroll(data[17].id)}>
			Scroll: row id 18
		</Button>
		<Button type="primary" onclick={() => doScroll(data[42].id)}>
			Scroll: row id 43
		</Button>
	</div>
	<div style="height: 510px;">
		<Grid {data} {columns} bind:this={api} footer reorder />
	</div>
</div>
