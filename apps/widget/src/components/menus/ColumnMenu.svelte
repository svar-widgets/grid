<script lang="ts">
	import { ActionMenu, registerMenuItem } from "@svar-ui/svelte-menu";
	import type { IMenuOption, IMenuOptionClick } from "@svar-ui/svelte-menu";
	import {
		getContext,
		setContext,
		type Component,
		type Snippet,
	} from "svelte";
	import {
		defaultColumnMenuOptions,
		assignChecks,
		handleAction,
	} from "@svar-ui/grid-store";
	import type { IApi, ICheckableItem, IRenderColumn } from "@svar-ui/grid-store";
	import type { TID } from "@svar-ui/lib-state";
	import HeaderMenuItem from "./HeaderMenuItem.svelte";
	import type { IColumnMenuContext } from "../../types";

	import { locale, type ILocale, type TPosition } from "@svar-ui/lib-dom";
	import { en } from "@svar-ui/grid-locales";

	registerMenuItem("columns-submenu", HeaderMenuItem as Component<any>);

	type Props = {
		api?: IApi;
		options?: IMenuOption[];
		at?: TPosition;
		// columns that show the menu icon; null shows it in all of them
		columns?: { [key: string]: boolean } | null;
		resolver?: (item: any, event: MouseEvent) => any;
		children?: Snippet;
		onclick?: (ev: IMenuOptionClick) => void;
	};

	let {
		api,
		options = defaultColumnMenuOptions,
		at = "point",
		columns = null,
		resolver = open,
		children,
		onclick,
	}: Props = $props();

	function getLabel(col: IRenderColumn) {
		for (let i = col.header!.length - 1; i >= 0; i--) {
			const text = col.header![i].text;
			if (text) return text;
		}
		return col.id;
	}

	const _ =
		getContext<ILocale | undefined>("wx-i18n")?.getGroup("grid") ||
		locale(en).getGroup("grid");

	function applyLocale(options: ICheckableItem[]) {
		options.forEach(op => {
			if (op.text) op.text = _(op.text);
			if (op.subtext) op.subtext = _(op.subtext);
			if (op.data) {
				applyLocale(op.data);
			}
		});
	}

	let columnId = $state<TID>();

	let reactiveState = $derived(api?.getReactiveState());

	let { sortMarks, split, _columns } = $derived(
		reactiveState ?? ({} as NonNullable<typeof reactiveState>)
	);

	setContext<IColumnMenuContext>("grid-column-menu", {
		get menuColumns() {
			return columns;
		},
	});

	function open(id: TID) {
		columnId = id;
		return id;
	}

	type THandleApi = Parameters<typeof handleAction>[0];

	const handleClicks = (ev: IMenuOptionClick) => {
		const option = ev.action;
		if (option) {
			if (option.comp === "columns-submenu") {
				handleAction(api as THandleApi, "hide-column", option.id);
			} else {
				handleAction(api as THandleApi, option.id as string, columnId);
			}
		}
		onclick?.(ev);
	};

	const normalizedOptions = $derived.by(() => {
		const filtered = filterItems(options);
		const submenuIdx = filtered.findIndex(opt => opt.id === "show-columns");
		if (submenuIdx !== -1) {
			filtered[submenuIdx] = {
				...filtered[submenuIdx],
				data: $_columns.map(c => ({
					id: c.id,
					text: getLabel(c),
					type: "columns-submenu",
					hidden: c.hidden,
				})) as IMenuOption[],
			};
		}

		const normalized = assignChecks(filtered as ICheckableItem[]);
		applyLocale(normalized);
		return normalized;
	});

	const finalOptions = $derived.by(() => {
		const opts: IMenuOption[] = [];
		if (columnId) {
			normalizedOptions.forEach(item => {
				if (!item.isDisabled) {
					opts.push(item);
					return;
				}
				const disabled = (item.isDisabled as any)(
					columnId,
					$_columns,
					$split
				);
				opts.push({
					...item,
					disabled,
				});
			});
		}
		return opts;
	});

	function filterItems(items: IMenuOption[]) {
		const sortOrder = $sortMarks?.[columnId!]?.order;
		if (!sortOrder) return items;

		return items.filter(item => {
			if (item.id === "sort-column:asc" && sortOrder === "asc")
				return false;
			if (item.id === "sort-column:desc" && sortOrder === "desc")
				return false;
			return true;
		});
	}
</script>

<ActionMenu
	dataKey="columnId"
	options={finalOptions}
	{at}
	{resolver}
	onclick={handleClicks}
>
	{@render children?.()}
</ActionMenu>
