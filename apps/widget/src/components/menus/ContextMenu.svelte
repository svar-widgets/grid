<script lang="ts">
	import { ContextMenu as BaseContextMenu } from "@svar-ui/svelte-menu";
	import type { IMenuOption, IMenuOptionClick } from "@svar-ui/svelte-menu";
	import { getContext, type Snippet } from "svelte";

	import {
		defaultMenuOptions,
		assignChecks,
		handleAction,
	} from "@svar-ui/grid-store";
	import type { IApi, ICheckableItem } from "@svar-ui/grid-store";
	import type { TID } from "@svar-ui/lib-state";
	import { locale, type ILocale, type TPosition } from "@svar-ui/lib-dom";
	import { en } from "@svar-ui/grid-locales";

	type Props = {
		api?: IApi;
		options?: IMenuOption[];
		at?: TPosition;
		resolver?: (item: any, event: MouseEvent) => any;
		dataKey?: string;
		filter?: (option: IMenuOption, item: any) => boolean;
		css?: string;
		children?: Snippet;
		onclick?: (ev: IMenuOptionClick) => void;
	};

	let {
		api,
		options = [...defaultMenuOptions],
		at = "point",
		resolver = getItem,
		dataKey,
		filter,
		css,
		children,
		onclick,
	}: Props = $props();

	const _ =
		getContext<ILocale | undefined>("wx-i18n")?.getGroup("grid") ||
		locale(en).getGroup("grid");

	let state = $derived(api?.getReactiveState());
	const { selectedRows, data, reorder } = $derived(
		state ?? ({} as NonNullable<typeof state>)
	);

	const normalizedOptions = $derived.by(() => {
		const filtered = filterItems(options);
		const normalized = assignChecks(filtered as ICheckableItem[]);
		applyLocale(normalized);
		return normalized;
	});

	// returns nothing, so the op.data assignment below empties nested options
	function applyLocale(options: ICheckableItem[]): undefined {
		options.forEach(op => {
			if (op.text) op.text = _(op.text);
			if (op.subtext) op.subtext = _(op.subtext);
			if (op.data) op.data = applyLocale(op.data);
		});
	}

	const finalOptions = $derived.by(() => {
		const opts: IMenuOption[] = [];
		normalizedOptions.forEach(item => {
			switch (item.id) {
				case "move-item:up":
				case "move-item:down":
				case "paste-row": {
					if (!item.isDisabled) {
						opts.push(item);
						return;
					}

					const disabled = (item.isDisabled as any)(
						item.id === "paste-row" ? api : $selectedRows,
						$data
					);

					opts.push({
						...item,
						disabled,
					});
					break;
				}
				default: {
					opts.push(item);
					break;
				}
			}
		});
		return opts;
	});

	function getItem(id: TID) {
		if (!$selectedRows!.includes(id)) {
			api!.exec("select-row", { id });
		}
		return id;
	}

	const handleClicks = (ev: IMenuOptionClick) => {
		const option = ev.action;
		if (option)
			handleAction(
				api as Parameters<typeof handleAction>[0],
				option.id as string
			);
		onclick?.(ev);
	};

	function filterItems(items: IMenuOption[]) {
		if ($reorder) return items;
		return items.filter(({ id }) => {
			return !(id === "move-item:up" || id === "move-item:down");
		});
	}
</script>

<BaseContextMenu
	css={`wx-table-menu ${css}`}
	{at}
	{dataKey}
	options={finalOptions}
	{resolver}
	{filter}
	onclick={handleClicks}
>
	{@render children?.()}
</BaseContextMenu>

<style>
	:global(.wx-menu .wx-option.wx-disabled) {
		pointer-events: none;
	}
	:global(.wx-menu .wx-option.wx-disabled .wx-value),
	:global(.wx-menu .wx-option.wx-disabled .wx-icon) {
		color: var(--wx-color-font-disabled);
	}
</style>
