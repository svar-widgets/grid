<script lang="ts">
	import { getContext, type ComponentProps } from "svelte";
	import { Toolbar as BaseToolbar } from "@svar-ui/svelte-toolbar";
	import {
		defaultToolbarButtons,
		assignChecks,
		handleAction,
	} from "@svar-ui/grid-store";
	import type { IApi, ICheckableItem } from "@svar-ui/grid-store";
	import { locale, type ILocale } from "@svar-ui/lib-dom";
	import { en } from "@svar-ui/grid-locales";

	type TToolbarProps = ComponentProps<typeof BaseToolbar>;
	type TItem = NonNullable<TToolbarProps["items"]>[number];

	type Props = TToolbarProps & {
		api?: IApi;
	};

	let {
		api,
		items = [...defaultToolbarButtons],
		onclick,
		...restProps
	}: Props = $props();

	const _ =
		getContext<ILocale | undefined>("wx-i18n")?.getGroup("grid") ||
		locale(en).getGroup("grid");

	let state = $derived(api?.getReactiveState());
	const { selectedRows, data, history, reorder, undo } = $derived(
		state ?? ({} as NonNullable<typeof state>)
	);

	const rowActions = [
		"open-editor",
		"delete-row",
		"copy-row",
		"cut-row",
		"paste-row",
		"move-item:up",
		"move-item:down",
	];
	const historyActions = ["undo", "redo"];

	const normalizedItems = $derived.by(() => {
		const filtered = filterItems(items);
		const normalized = assignChecks(filtered as ICheckableItem[]);
		applyLocale(normalized);
		return normalized;
	});

	// returns nothing, so the op.items assignment below empties nested items
	function applyLocale(options: ICheckableItem[]): undefined {
		options.forEach(op => {
			if (op.text) op.text = _(op.text);
			if (op.menuText) op.menuText = _(op.menuText);
			if (op.items) op.items = applyLocale(op.items);
		});
	}

	function filterItems(items: TItem[]) {
		if ($undo && $reorder) return items;
		return items.filter(({ id }) => {
			return !(
				(!$undo && (id === "undo" || id === "redo")) ||
				(!$reorder &&
					(id === "move-item:up" || id === "move-item:down"))
			);
		});
	}

	const buttons = $derived.by(() => {
		const finalButtons: TItem[] = [];
		const selected = $selectedRows?.length;
		normalizedItems.forEach(item => {
			const action = item.id as string;
			if (action === "add-row") {
				finalButtons.push(item);
			} else if (rowActions.includes(action)) {
				if (!selected) return;
				finalButtons.push({
					...item,
					disabled:
						item.isDisabled &&
						(item.isDisabled as any)(
							action === "paste-row" ? api : $selectedRows,
							$data
						),
				});
			} else if (historyActions.includes(action)) {
				finalButtons.push({
					...item,
					disabled: (item.isDisabled as any)($history),
				});
			} else {
				finalButtons.push(item);
			}
		});
		return finalButtons;
	});

	const handleClicks = (ev: { item: TItem }) => {
		const option = ev.item;
		if (option)
			handleAction(
				api as Parameters<typeof handleAction>[0],
				option.id as string
			);
		onclick?.(ev);
	};
</script>

<BaseToolbar items={buttons} onclick={handleClicks} {...restProps} />
