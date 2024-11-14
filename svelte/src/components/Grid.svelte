<script>
	// svelte core
	import { createEventDispatcher, getContext, setContext } from "svelte";
	import { writable } from "svelte/store";
	const dispatch = createEventDispatcher();

	// core widgets lib
	import { Locale } from "wx-svelte-core";
	import { en } from "wx-grid-locales";

	// stores
	import { EventBusRouter } from "wx-lib-state";
	import { DataStore } from "wx-grid-store";

	// ui
	import Layout from "./Layout.svelte";

	// incoming parameters
	export let data = [];
	export let columns = [];

	export let rowStyle = null;
	export let columnStyle = null;
	export let cellStyle = null;

	export let selected = null;
	export let selectedRows = [];
	export let select = true;
	export let multiselect = false;

	export let header = true;
	export let footer = false;
	export let dynamic = null;
	export let filter = null;
	export let overlay = null;
	export let autoRowHeight = false;
	export let sizes = {};
	export let split = { left: 0 };

	export let tree = false;
	export let autoConfig = false;

	export let init = null;

	// auto config columns
	$: if (autoConfig && !columns.length && data.length) {
		const test = data[0];

		for (let key in test)
			if (key != "id" && key[0] != "$") {
				let col = {
					id: key,
					header: key[0].toUpperCase() + key.substr(1),
				};

				if (typeof autoConfig === "object")
					col = { ...col, ...autoConfig };
				columns.push(col);
			}
	}
	//sync selection props
	$: {
		if (selectedRows.length) selected = selectedRows[0];
		else if (selected) selectedRows.push(selected);
	}

	$: _skin = getContext("wx-theme");

	// init stores
	const dataStore = new DataStore(writable);
	$: {
		dataStore.init({
			data,
			columns,
			split,
			sizes,
			selected,
			selectedRows,
			dynamic,
			filter,
			tree,
			_skin,
		});

		if (init) {
			init(api);
			init = null;
		}
	}

	// define event route
	let firstInRoute = dataStore.in;
	let lastInRoute = new EventBusRouter(dispatch);
	firstInRoute.setNext(lastInRoute);

	// public API
	export const api = {
		// state
		getState: dataStore.getState.bind(dataStore),
		getReactiveState: dataStore.getReactive.bind(dataStore),
		getStores: () => ({ data: dataStore }),

		// events
		exec: firstInRoute.exec,
		setNext: ev => (lastInRoute = lastInRoute.setNext(ev)),
		intercept: firstInRoute.intercept.bind(firstInRoute),
		on: firstInRoute.on.bind(firstInRoute),
		detach: firstInRoute.detach.bind(firstInRoute),

		// extra api
		getRow: id => dataStore.getRow(id),
		getColumn: id => dataStore.getColumn(id),
	};

	// common API available in components
	setContext("grid-store", {
		getReactiveState: dataStore.getReactive.bind(dataStore),
		exec: firstInRoute.exec.bind(firstInRoute),
		getRow: dataStore.getRow.bind(dataStore),
	});
</script>

<Locale words={en} optional={true}>
	<Layout
		{header}
		{footer}
		{overlay}
		{rowStyle}
		{columnStyle}
		{cellStyle}
		{select}
		{multiselect}
		{autoRowHeight}
	/>
</Locale>
