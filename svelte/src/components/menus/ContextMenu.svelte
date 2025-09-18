<script>
	import { ContextMenu } from "@svar-ui/svelte-menu";
	import { getContext } from "svelte";
	import { defaultMenuOptions } from "../../../src";
	import { locale } from "@svar-ui/lib-dom";
	import { en } from "@svar-ui/grid-locales";

	let {
		api,
		options = defaultMenuOptions,
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

	const localize = options => {
		return options.map(o => {
			o.text = _(o.text);
			return o;
		});
	};

	function getItem(id) {
		if (id) api.exec("select-row", { id });
		return id;
	}

	const handleClicks = ev => {
		const option = ev.action;
		if (option) {
			const id = api.getState().selectedRows[0];
			switch (option.id) {
				case "add:before":
					api.exec("add-row", { row: {}, before: id });
					break;
				case "add:after":
					api.exec("add-row", { row: {}, after: id });
					break;
				case "copy":
					api.exec("add-row", {
						row: { ...api.getRow(id), id: null },
						after: id,
					});
					break;
				case "delete":
					api.exec("delete-row", { id });
					break;
				default:
					onclick(ev);
			}
		}
	};
</script>

<ContextMenu
	css={`wx-table-menu ${css}`}
	{at}
	{dataKey}
	options={localize(options)}
	{resolver}
	{filter}
	onclick={handleClicks}
>
	{@render children?.()}
</ContextMenu>
