<script>
	import { getData } from "../../data";
	import { Grid } from "../../../src";
	import { Material, Locale } from "wx-svelte-core";

	const { data, columnsVertical: columns } = getData();
	data.length = 5;

	let api;
</script>

<Material>
	<Locale>
		<div class="demo" style="padding: 20px;">
			<div>
				<Grid {data} {columns} footer={true} bind:api />
			</div>
		</div>
	</Locale>
</Material>

<style>
	.demo {
		--wx-table-header-cell-border: var(--wx-table-cell-border);
		--wx-table-footer-cell-border: var(--wx-table-cell-border);
	}

	.demo :global(.wx-footer) {
		border-bottom: none;
	}
</style>
