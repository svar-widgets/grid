<script>
	// svelte core
	import { getContext, setContext } from "svelte";
	import { writable } from "svelte/store";

	// core widgets lib
	import { Locale } from "wx-svelte-core";
	import { en } from "wx-grid-locales";

	// stores
	import { EventBusRouter } from "wx-lib-state";
	import { DataStore } from "wx-grid-store";

	// ui
	import Layout from "./Layout.svelte";

	let {
		data = [],
		columns = [],
		rowStyle = null,
		columnStyle = null,
		cellStyle = null,
		selectedRows = [],
		select = true,
		multiselect = false,
		header = true,
		footer = false,
		dynamic = null,
		editor = null,
		filter = null,
		overlay = null,
		autoRowHeight = false,
		sizes = {},
		split = { left: 0 },
		tree = false,
		autoConfig = false,
		init = null,
		...restProps
	} = $props();

	// init stores
	const dataStore = new DataStore(writable);

	// define event route
	let firstInRoute = dataStore.in;

	const dash = /-/g;
	let lastInRoute = new EventBusRouter((a, b) => {
		const name = "on" + a.replace(dash, "");
		if (restProps[name]) {
			restProps[name](b);
		}
	});
	firstInRoute.setNext(lastInRoute);

	// public API
	export const // state
		getState = dataStore.getState.bind(dataStore),
		getReactiveState = dataStore.getReactive.bind(dataStore),
		getStores = () => ({ data: dataStore }),
		// events
		exec = firstInRoute.exec,
		setNext = ev => (lastInRoute = lastInRoute.setNext(ev)),
		intercept = firstInRoute.intercept.bind(firstInRoute),
		on = firstInRoute.on.bind(firstInRoute),
		detach = firstInRoute.detach.bind(firstInRoute),
		// extra api
		getRow = id => dataStore.getRow(id),
		getColumn = id => dataStore.getColumn(id);

	const api = {
		exec,
		setNext,
		intercept,
		on,
		detach,
		getRow,
		getColumn,
		getState,
		getReactiveState,
		getStores,
	};

	// common API available in components
	setContext("grid-store", {
		getState: dataStore.getState.bind(dataStore),
		getReactiveState: dataStore.getReactive.bind(dataStore),
		exec: firstInRoute.exec.bind(firstInRoute),
		getRow: dataStore.getRow.bind(dataStore),
	});
	// auto config columns
	const finalColumns = $derived.by(() => {
		let res = columns;
		if (autoConfig && !res.length && data.length) {
			const test = data[0];

			for (let key in test) {
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
		}

		return columns;
	});

	let _skin = $derived(getContext("wx-theme"));

	let init_once = true;
	const reinitStore = () => {
		dataStore.init({
			data,
			editor,
			columns: finalColumns,
			split,
			sizes,
			selectedRows,
			dynamic,
			filter,
			tree,
			_skin,
		});

		if (init_once && init) {
			init(api);
			init_once = false;
		}
	};

	reinitStore();
	$effect(reinitStore);
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
