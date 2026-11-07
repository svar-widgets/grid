<script lang="ts">
	import { getData } from "../data";
	import { Grid } from "@svar-ui/svelte-grid";

	const { data, columns } = getData();
</script>

<div style="padding: 20px;">
	<div>
		<Grid {data} {columns} />
	</div>
</div>
