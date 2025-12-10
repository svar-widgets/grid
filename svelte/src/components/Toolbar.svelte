<script>
	import { getContext } from "svelte";
	import { Toolbar } from "@svar-ui/svelte-toolbar";
	import {
		defaultToolbarButtons,
		assignChecks,
		handleAction,
	} from "@svar-ui/grid-store";
	import { locale } from "@svar-ui/lib-dom";
	import { en } from "@svar-ui/grid-locales";

	let {
		api,
		items = [...defaultToolbarButtons],
		onclick,
		...restProps
	} = $props();

	const _ =
		getContext("wx-i18n")?.getGroup("grid") || locale(en).getGroup("grid");

	let state = $derived(api?.getReactiveState());
	const { selectedRows, data, history, reorder, undo } = $derived(
		state ?? {}
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
		const normalized = assignChecks(filtered);
		applyLocale(normalized);
		return normalized;
	});

	function applyLocale(options) {
		options.forEach(op => {
			if (op.text) op.text = _(op.text);
			if (op.menuText) op.menuText = _(op.menuText);
			if (op.items) op.items = applyLocale(op.items);
		});
	}

	function filterItems(items) {
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
		const finalButtons = [];
		const selected = $selectedRows?.length;
		normalizedItems.forEach(item => {
			const action = item.id;
			if (action === "add-row") {
				finalButtons.push(item);
			} else if (rowActions.includes(action)) {
				if (!selected) return;
				finalButtons.push({
					...item,
					disabled:
						item.isDisabled &&
						item.isDisabled(
							action === "paste-row" ? api : $selectedRows,
							$data
						),
				});
			} else if (historyActions.includes(action)) {
				finalButtons.push({
					...item,
					disabled: item.isDisabled($history),
				});
			} else {
				finalButtons.push(item);
			}
		});
		return finalButtons;
	});

	const handleClicks = ev => {
		const option = ev.item;
		if (option) handleAction(api, option.id);
		onclick && onclick(ev);
	};
</script>

<Toolbar items={buttons} onclick={handleClicks} {...restProps} />
