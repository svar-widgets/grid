<script>
	import { ContextMenu } from "@svar-ui/svelte-menu";
	import { getContext } from "svelte";

	import {
		defaultMenuOptions,
		assignChecks,
		handleAction,
	} from "@svar-ui/grid-store";
	import { locale } from "@svar-ui/lib-dom";
	import { en } from "@svar-ui/grid-locales";

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
	} = $props();

	const _ =
		getContext("wx-i18n")?.getGroup("grid") || locale(en).getGroup("grid");

	let state = $derived(api?.getReactiveState());
	const { selectedRows, data, reorder } = $derived(state ?? {});

	const normalizedOptions = $derived.by(() => {
		const filtered = filterItems(options);
		const normalized = assignChecks(filtered);
		applyLocale(normalized);
		return normalized;
	});

	function applyLocale(options) {
		options.forEach(op => {
			if (op.text) op.text = _(op.text);
			if (op.subtext) op.subtext = _(op.subtext);
			if (op.data) op.data = applyLocale(op.data);
		});
	}

	const finalOptions = $derived.by(() => {
		const opts = [];
		normalizedOptions.forEach(item => {
			switch (item.id) {
				case "move-item:up":
				case "move-item:down":
				case "paste-row": {
					if (!item.isDisabled) {
						opts.push(item);
						return;
					}

					const disabled = item.isDisabled(
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

	function getItem(id) {
		if (!$selectedRows.includes(id)) {
			api.exec("select-row", { id });
		}
		return id;
	}

	const handleClicks = ev => {
		const option = ev.action;
		if (option) handleAction(api, option.id);
		onclick && onclick(ev);
	};

	function filterItems(items) {
		if ($reorder) return items;
		return items.filter(({ id }) => {
			return !(id === "move-item:up" || id === "move-item:down");
		});
	}
</script>

<ContextMenu
	css={`wx-table-menu ${css}`}
	{at}
	{dataKey}
	options={finalOptions}
	{resolver}
	{filter}
	onclick={handleClicks}
>
	{@render children?.()}
</ContextMenu>

<style>
	:global(.wx-menu .wx-option.wx-disabled) {
		pointer-events: none;
	}
	:global(.wx-menu .wx-option.wx-disabled .wx-value),
	:global(.wx-menu .wx-option.wx-disabled .wx-icon) {
		color: var(--wx-color-font-disabled);
	}
</style>
