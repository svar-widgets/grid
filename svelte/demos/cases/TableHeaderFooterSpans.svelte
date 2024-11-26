<script>
	import { getData } from "../data";
	import { Grid, HeaderMenu } from "../../src/";

	const { data, columnsSpans } = getData();

	let api = $state();
</script>

<div class="demo" style="padding: 20px;">
	<div>
		<HeaderMenu {api}>
			<Grid {data} columns={columnsSpans} footer={true} bind:this={api} />
		</HeaderMenu>
	</div>
</div>

<style>
	.demo :global(.center) {
		justify-content: center;
	}

	.demo :global(.right) {
		justify-content: right;
	}
</style>
