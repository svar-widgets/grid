<script>
	import { Grid } from "../../src/";
	import { Material, Locale } from "wx-svelte-core";

	const columns = [
		{ id: 1, header: "Continent" },
		{ id: 2, header: "Name" },
		{ id: 3, header: [{ text: 2015, colspan: 3 }, "Oil (count)"] },
		{ id: 4, header: ["", "Oil (sum)"] },
		{ id: 5, header: ["", "GDP (sum)"] },
		{ id: 6, header: [{ text: 2017, colspan: 3 }, "Oil (count)"] },
		{ id: 7, header: ["", "Oil (sum)"] },
		{ id: 8, header: ["", "GDP (sum)"] },
		{ id: 9, header: [{ text: 2014, colspan: 3 }, "Oil (count)"] },
		{ id: 10, header: ["", "Oil (sum)"] },
		{ id: 11, header: ["", "GDP (sum)"] },
		{ id: 12, header: [{ text: 2013, colspan: 3 }, "Oil (count)"] },
		{ id: 13, header: ["", "Oil (sum)"] },
		{ id: 14, header: ["", "GDP (sum)"] },
		{ id: 15, header: [{ text: 2012, colspan: 3 }, "Oil (count)"] },
		{ id: 16, header: ["", "Oil (sum)"] },
		{ id: 17, header: ["", "GDP (sum)"] },
		{ id: 18, header: [{ text: 2016, colspan: 3 }, "Oil (count)"] },
		{ id: 19, header: ["", "Oil (sum)"] },
		{ id: 20, header: ["", "GDP (sum)"] },
	];

	const data = [
		{
			1: "South America",
			2: "Argentina",
			3: "1.000",
			4: "1.545",
			5: "181.357",
			6: "1.000",
			7: "1.732",
			8: "212.507",
			9: "3.000",
			10: "9.804",
			11: "890.239",
			12: "1.000",
			13: "4.474",
			14: "367.565",
			15: "1.000",
			16: "9.414",
			17: "444.612",
			18: "2.000",
			19: "21.347",
			20: "969.879",
			id: "p1662654072112",
		},
		{
			1: "South America",
			2: "Brazil",
			3: "1.000",
			4: "16.475",
			5: "1622.311",
			6: "",
			7: "",
			8: "",
			9: "4.000",
			10: "96.039",
			11: "6815.952",
			12: "3.000",
			13: "83.368",
			14: "5232.456",
			15: "1.000",
			16: "39.648",
			17: "2503.869",
			18: "",
			19: "",
			20: "",
			id: "p1662654072113",
		},
	];
</script>

<Material>
	<Locale>
		<div class="demo" style="padding: 20px;">
			<div>
				<Grid {data} {columns} footer={true} />
			</div>
		</div>
	</Locale>
</Material>

<style>
	.demo :global(.wx-h-row .wx-cell),
	.demo :global(.wx-f-row .wx-cell) {
		border-right: var(--wx-border);
		border-bottom: var(--wx-border);
	}
</style>
