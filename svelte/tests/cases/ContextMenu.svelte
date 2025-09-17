<script>
	import { getData } from "../data";
	import { Grid, ContextMenu } from "../../src/";
	import { Willow, Locale } from "@svar-ui/svelte-core";

	const { data } = getData();

	const columns = [
		{ id: "id", width: 50 },
		{ id: "city", header: "City", width: 160, hidden: true },
		{ id: "firstName", header: "First Name", flexgrow: 1 },
		{ id: "lastName", header: "Last Name", flexgrow: 1 },
		{ id: "companyName", header: "Company", flexgrow: 1 },
	];

	let table = $state();
	function init(api) {
		table = api;
	}
</script>

<Willow>
	<Locale>
		<div style="padding: 20px;">
			<div>
				<ContextMenu api={table}>
					<Grid {data} {columns} {init} />
				</ContextMenu>
			</div>
		</div>
	</Locale>
</Willow>
