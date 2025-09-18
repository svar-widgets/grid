<script>
	// svelte core
	import { getContext, setContext } from "svelte";
	import { writable } from "svelte/store";

	// core widgets lib
	import { Locale } from "@svar-ui/svelte-core";
	import { en } from "@svar-ui/grid-locales";

	// stores
	import { EventBusRouter } from "@svar-ui/lib-state";
	import { DataStore, isCommunity } from "@svar-ui/grid-store";

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
		overlay = null,
		reorder = false,
		onreorder = null,
		autoRowHeight = false,
		sizes = {},
		split = { left: 0 },
		tree = false,
		autoConfig = false,
		init = null,
		responsive = null,
		sortMarks = {},
		undo = false,
		...restProps
	} = $props();

	let clientWidth = $state(0);
	let clientHeight = $state(0);
	let responsiveLevel = $state(null);
	let responsiveConfig = $state(null);

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
		getRowIndex: dataStore.getRowIndex.bind(dataStore),
	});
	// auto config columns
	const finalColumns = $derived.by(() => {
		if (autoConfig && !columns.length && data.length) {
			const test = data[0];
			const autoCols = [];

			for (let key in test) {
				if (key !== "id" && key[0] !== "$") {
					let col = {
						id: key,
						header: key[0].toUpperCase() + key.slice(1),
					};

					if (typeof autoConfig === "object") {
						col = { ...col, ...autoConfig };
					}
					autoCols.push(col);
				}
			}

			return autoCols;
		}

		return responsiveConfig?.columns ?? columns;
	});

	const finalSizes = $derived(responsiveConfig?.sizes ?? sizes);

	function resize(rect) {
		clientWidth = rect.width;
		clientHeight = rect.height;

		if (responsive) {
			const levels = Object.keys(responsive)
				.map(Number)
				.sort((a, b) => a - b);

			const newLevel = levels.find(level => clientWidth <= level) ?? null;

			if (newLevel !== responsiveLevel) {
				responsiveConfig = responsive[newLevel];
				responsiveLevel = newLevel;
			}
		}
	}

	const isReorderAvailable = $derived.by(() => {
		let available = !tree;
		if (!isCommunity()) available = true;

		return available ? reorder : false;
	});

	let _skin = $derived(getContext("wx-theme"));
	let init_once = true;
	const reinitStore = () => {
		dataStore.init({
			data,
			columns: finalColumns,
			split,
			sizes: finalSizes,
			selectedRows,
			dynamic,
			tree,
			sortMarks,
			select,
			undo,
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
		reorder={isReorderAvailable}
		{onreorder}
		{multiselect}
		{autoRowHeight}
		{clientWidth}
		{clientHeight}
		{responsiveLevel}
		{resize}
	/>
</Locale>
