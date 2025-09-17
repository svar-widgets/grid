<script>
	import { getOptions } from "@svar-ui/query-store";
	import { Query, createArrayFilter } from "@svar-ui/svelte-query";
	import { Willow, Locale } from "@svar-ui/svelte-core";

	import { getData } from "../data";
	import { Grid } from "../../src/";

	const { data, columns } = getData();

	let filteredData = $state(data);

	function applyFilter(value) {
		const filter = createArrayFilter(value);
		filteredData = filter(data);
	}

	let options = $state({});
	let fields = $state([]);
	let cols = $state();
	let api = $state();

	function getLabel(col) {
		if (col.header) {
			if (typeof col.header === "string") return col.header;
			if (col.header.length)
				for (let i = col.header.length - 1; i >= 0; i--) {
					const text = col.header[i].text;
					if (text) return text;
					if (col.header[i] && typeof col.header[i] === "string")
						return col.header[i];
				}
			else if (col.header.text) return col.header.text;
		}
		return col.id;
	}

	function init(api) {
		fields = [];
		cols = api.getReactiveState().columns;
		$cols.forEach(col => {
			if (col.id !== "id") {
				options[col.id] = getOptions(data, col.id);
				fields.push({
					id: col.id,
					name: getLabel(col),
					type: "text",
				});
			}
		});
	}
</script>

<Willow>
	<Locale>
		<div style="padding: 20px;">
			<div>
				<Query
					{fields}
					{options}
					type={"line"}
					onchange={ev => applyFilter(ev.value)}
				/>

				<Grid data={filteredData} {columns} bind:this={api} {init} />
			</div>
		</div>
	</Locale>
</Willow>
