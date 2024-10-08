<script>
	import { Grid } from "../../src";
	import { getData } from "../data";
	import { Material, Locale } from "wx-svelte-core";

	const { data, columns } = getData();
</script>

<Material>
	<Locale>
		<div style="padding: 20px; width: 360px">
			<Grid {data} {columns} />
		</div>
	</Locale>
</Material>
