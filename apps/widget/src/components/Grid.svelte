<script lang="ts">
	// svelte core
	import { getContext, setContext, type Component } from "svelte";
	import { writable } from "svelte/store";

	// core widgets lib
	import { Locale } from "@svar-ui/svelte-core";
	import { en } from "@svar-ui/grid-locales";

	// stores
	import { EventBusRouter } from "@svar-ui/lib-state";
	import type { TID } from "@svar-ui/lib-state";
	import { DataStore, isCommunity } from "@svar-ui/grid-store";
	import type {
		IApi,
		IFilterValues,
		IRow,
		ISizeConfig,
		ISortMarks,
		ISplitConfig,
		TDynamicConfig,
		TSkinName,
	} from "@svar-ui/grid-store";
	import type {
		GridActions,
		IColumnConfig,
		IColumnMenuContext,
		IInnerApi,
		TCellStyle,
		TColumnStyle,
		TRowStyle,
	} from "../types";

	// ui
	import Layout from "./Layout.svelte";

	type TResponsiveConfig = {
		sizes?: ISizeConfig;
		columns?: IColumnConfig[];
	};

	type Props = {
		data?: IRow[];
		columns?: IColumnConfig[];
		rowStyle?: TRowStyle | null;
		columnStyle?: TColumnStyle | null;
		cellStyle?: TCellStyle | null;
		selectedRows?: TID[];
		select?: boolean;
		multiselect?: boolean;
		header?: boolean;
		footer?: boolean;
		dynamic?: TDynamicConfig | null;
		overlay?: string | Component<any> | null;
		reorder?: boolean;
		draggableRows?: boolean | ((row: IRow) => boolean);
		autoRowHeight?: boolean;
		sizes?: ISizeConfig;
		split?: ISplitConfig;
		tree?: boolean;
		autoConfig?: boolean | IColumnConfig;
		init?: ((api: IApi) => void) | null;
		responsive?: { [key: string]: TResponsiveConfig } | null;
		sortMarks?: ISortMarks;
		undo?: boolean;
		hotkeys?:
			| false
			| { [key: string]: ((e: KeyboardEvent) => void) | boolean }
			| null;
		filterValues?: IFilterValues;
		resizeRow?: boolean;
	} & GridActions;

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
		draggableRows = false,
		onreorder,
		autoRowHeight = false,
		sizes = {},
		split = { left: 0 },
		tree = false,
		autoConfig = false,
		init = null,
		responsive = null,
		sortMarks = {},
		undo = false,
		hotkeys = null,
		filterValues = {},
		resizeRow = false,
		...restProps
	}: Props = $props();

	const resizeRowProp = $derived(resizeRow && !isCommunity());

	let clientWidth = $state(0);
	let clientHeight = $state(0);
	let responsiveLevel = $state<number | null>(null);
	let responsiveConfig = $state<TResponsiveConfig | null>(null);

	// init stores
	const dataStore = new DataStore(writable);

	// define event route
	let firstInRoute = dataStore.in;

	const dash = /-/g;
	let lastInRoute: any = new EventBusRouter((a: string, b: any) => {
		const name = "on" + a.replace(dash, "");
		// on<action> handlers are forwarded to the event bus via restProps
		const handler = (restProps as Record<string, (ev: any) => void>)[name];
		if (handler) {
			handler(b);
		}
	});
	firstInRoute.setNext(lastInRoute);

	// public API, the same as the IApi that init() gets
	export const // state
		getState: IApi["getState"] = dataStore.getState.bind(dataStore),
		getReactiveState: IApi["getReactiveState"] = dataStore.getReactive.bind(
			dataStore
		) as IApi["getReactiveState"],
		getStores: IApi["getStores"] = () => ({ data: dataStore }),
		// events
		exec: IApi["exec"] = firstInRoute.exec as IApi["exec"],
		setNext: IApi["setNext"] = (ev: any) =>
			(lastInRoute = lastInRoute.setNext(ev)),
		intercept: IApi["intercept"] = firstInRoute.intercept.bind(
			firstInRoute
		) as IApi["intercept"],
		on: IApi["on"] = firstInRoute.on.bind(firstInRoute) as IApi["on"],
		detach: IApi["detach"] = firstInRoute.detach.bind(
			firstInRoute
		) as IApi["detach"],
		// extra api
		getRow: IApi["getRow"] = (id: TID) => dataStore.getRow(id),
		getColumn: IApi["getColumn"] = (id: TID) => dataStore.getColumn(id);

	const api: IApi = {
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
	setContext<IInnerApi>("grid-store", {
		getState: dataStore.getState.bind(dataStore),
		getReactiveState: dataStore.getReactive.bind(dataStore),
		exec: firstInRoute.exec.bind(firstInRoute),
		getRow: dataStore.getRow.bind(dataStore),
	} as unknown as IInnerApi);
	// auto config columns
	const finalColumns = $derived.by((): IColumnConfig[] => {
		if (autoConfig && !columns.length && data.length) {
			const test = data[0];
			const autoCols: IColumnConfig[] = [];

			for (let key in test) {
				if (key !== "id" && key !== "rowHeight" && key[0] !== "$") {
					let col: IColumnConfig = {
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

	const columnMenuStore = getContext<IColumnMenuContext | undefined>(
		"grid-column-menu"
	);

	const columnsMenuList = $derived(
		!columnMenuStore
			? {}
			: columnMenuStore.menuColumns === null
				? Object.fromEntries(
						finalColumns?.map(col => [col.id, true]) ?? []
					)
				: columnMenuStore.menuColumns
	);

	const finalSizes = $derived(responsiveConfig?.sizes ?? sizes);

	function resize(rect: { width: number; height: number }) {
		clientWidth = rect.width;
		clientHeight = rect.height;

		if (responsive) {
			const levels = Object.keys(responsive)
				.map(Number)
				.sort((a, b) => a - b);

			const newLevel = levels.find(level => clientWidth <= level) ?? null;

			if (newLevel !== responsiveLevel) {
				responsiveConfig = responsive[newLevel as number];
				responsiveLevel = newLevel;
			}
		}
	}

	let _skin = $derived(getContext<TSkinName>("wx-theme"));
	let init_once = true;

	const reinitStore = () => {
		dataStore.init({
			data,
			columns: finalColumns as any,
			menuColumns: columnsMenuList,
			split,
			sizes: finalSizes,
			selectedRows,
			dynamic: dynamic as TDynamicConfig,
			tree,
			sortMarks,
			filterValues,
			select,
			undo,
			reorder,
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
		{onreorder}
		{draggableRows}
		{multiselect}
		{autoRowHeight}
		{clientWidth}
		{clientHeight}
		{responsiveLevel}
		{resize}
		{hotkeys}
		resizeRow={resizeRowProp}
	/>
</Locale>
