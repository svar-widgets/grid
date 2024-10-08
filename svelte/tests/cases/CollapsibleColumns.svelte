<script>
	import { getData } from "../data";
	import { Grid } from "../../src";
	import { Material, Locale } from "wx-svelte-core";

	const { data, collapsibleColumns } = getData();
</script>

<Material>
	<Locale>
		<div class="demo" style="padding: 20px;">
			<div>
				<Grid
					{data}
					columns={collapsibleColumns("first")}
					footer={true}
				/>
			</div>
		</div>

		<div class="demo" style="padding: 20px;">
			<div>
				<Grid {data} columns={collapsibleColumns()} footer={true} />
			</div>
		</div>
	</Locale>
</Material>

<style>
	.demo :global(.center) {
		justify-content: center;
	}

	.demo :global(.wx-h-row .wx-cell:not(:last-child)),
	.demo :global(.wx-f-row .wx-cell:not(:last-child)) {
		border-right: var(--wx-table-cell-border);
	}

	.demo :global(.wx-h-row:not(:last-child)) {
		border-bottom: var(--wx-table-cell-border);
	}
</style>
