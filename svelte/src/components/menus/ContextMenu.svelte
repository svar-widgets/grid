<script>
	import { ContextMenu } from "wx-svelte-menu";
	import { getContext, createEventDispatcher } from "svelte";
	import { defaultMenuOptions } from "../../../src";

	export let api;

	export let handler;
	export let options = defaultMenuOptions;
	export let at = "point";
	export let resolver = getItem;
	export let dataKey;
	export let filter;
	export let css;

	const _ = getContext("wx-i18n").getGroup("grid");
	const dispatch = createEventDispatcher();

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
		const option = ev.detail.action;
		if (option) {
			const id = api.getState().selected;
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
					dispatch("click", ev.detail);
			}
		}
	};
</script>

<ContextMenu
	css={`wx-table-menu ${css}`}
	{at}
	{dataKey}
	options={localize(options)}
	{handler}
	{resolver}
	{filter}
	on:click={handleClicks}
>
	<slot />
</ContextMenu>
