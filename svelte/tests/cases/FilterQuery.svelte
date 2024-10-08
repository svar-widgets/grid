<script>
	import { getOptions } from "wx-query-store";
	import { Query, createArrayFilter } from "wx-svelte-query";
	import { Material, Locale } from "wx-svelte-core";

	import { getData } from "../data";
	import { Grid } from "../../src/";

	const { data, columns } = getData();

	let filteredData = data;

	function applyFilter(value) {
		const filter = createArrayFilter(value);
		filteredData = filter(data);
	}

	let options = {};
	let fields = [];
	let cols;
	let api;
	$: {
		if (api) {
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
	}

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
</script>

<Material>
	<Locale>
		<div style="padding: 20px;">
			<div>
				<Query
					{fields}
					{options}
					type={"line"}
					on:change={ev => applyFilter(ev.detail.value)}
				/>

				<Grid data={filteredData} {columns} bind:api />
			</div>
		</div>
	</Locale>
</Material>
