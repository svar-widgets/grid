<script>
	import { Grid } from "../../src";
	import { getData } from "../data";
	import { Willow, Locale } from "@svar-ui/svelte-core";

	const { data, columns } = getData();
</script>

<Willow>
	<Locale>
		<div style="padding: 20px; width: 360px">
			<Grid {data} {columns} />
		</div>
	</Locale>
</Willow>
