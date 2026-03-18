<script>
	import { getContext } from "svelte";
	import {
		FilterQuery,
		createFilter,
		getQueryString,
		getOptionsMap,
	} from "@svar-ui/svelte-filter";
	import { Grid } from "../../src";
	import { getData } from "../data";

	const helpers = getContext("wx-helpers");

	const { allData, allColumns, countries } = getData();
	let textValue = $state("Country: Brasil and Email: contains yahoo");

	let api = $state();
	let filter = $state();

	$effect(() => {
		if (api && filter !== undefined) api.exec("filter-rows", { filter });
	});

	let options = getOptionsMap(allData);

	function numberToCountry(n) {
		return countries.find(c => c.id == n).label;
	}

	let fields = [
		{
			id: "country",
			label: "Country",
			type: "tuple",
			format: numberToCountry,
		},
		{ id: "city", label: "City", type: "text" },
		{ id: "firstName", label: "First Name", type: "text" },
		{ id: "lastName", label: "Last Name", type: "text" },
		{ id: "email", label: "Email", type: "text" },
		{ id: "companyName", label: "Company", type: "text" },
		{ id: "stars", label: "Stars", type: "number" },
		{ id: "date", label: "Start Date", type: "date" },
	];

	async function handleFilter({
		value,
		error,
		text,
		startProgress,
		endProgress,
	}) {
		if (text) {
			error = null;
			try {
				startProgress();
				value = await text2filter(text, fields);
				textValue = value ? getQueryString(value).query : "";
			} catch (e) {
				error = e;
			} finally {
				endProgress();
			}
		}

		if (error) {
			helpers.showNotice({
				text: error.message,
				type: "danger",
			});

			if (error.code !== "NO_DATA") return;
		}

		filter = createFilter(value, {}, fields);
	}

	const url =
		"https://master--svar-filter-natural-text--dev.webix.io/text-to-json";
	async function text2filter(text, fields) {
		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify({ text, fields }),
		});
		const json = await response.json();
		if (!response.ok) {
			helpers.showNotice({
				text: json.error || "Request failed",
				type: "danger",
			});
			return null;
		}
		return json;
	}
</script>

<div style="padding: 20px; max-width:1330px;">
	<h4>Filter grid data with FilterQuery in AI-powered mode</h4>
	<FilterQuery
		value={textValue}
		placeholder="E.g. Stars: >3000"
		{fields}
		{options}
		onchange={handleFilter}
	/>
	<p class="hint">
		Type filter conditions using query syntax or natural language. Examples:
	</p>
	<ul class="examples">
		<li>Stars: &gt;500 and City: Eulaliabury</li>
		<li>StartDate: &gt;= 2026-03-01</li>
		<li>FirstName: Erick, Hubert</li>
		<li>Started in winter</li>
		<li>Live in Europe</li>
	</ul>
	<div style="height: 600px;">
		<Grid data={allData} columns={allColumns} bind:this={api} />
	</div>
</div>

<style>
	.hint {
		margin: 12px 0 8px 0;
		font-size: 14px;
	}
	.examples {
		margin: 0;
		padding-left: 20px;
		font-size: 13px;
	}
	.examples li {
		margin: 4px 0;
	}
</style>
