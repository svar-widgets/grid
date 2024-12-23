<script>
	import { getData } from "../../data";
	import { Grid } from "../../../src";
	import { Willow, Locale } from "wx-svelte-core";

	const { data, columnsVertical: columns } = $state(getData());
	data.length = 5;

	let api = $state();
</script>

<Willow>
	<Locale>
		<div class="demo" style="padding: 20px;">
			<div>
				<Grid {data} {columns} footer={true} bind:this={api} />
			</div>
		</div>
	</Locale>
</Willow>

<style>
	.demo {
		--wx-table-header-cell-border: var(--wx-table-cell-border);
		--wx-table-footer-cell-border: var(--wx-table-cell-border);
	}

	.demo :global(.wx-footer) {
		border-bottom: none;
	}
</style>
