<script lang="ts">
	import { getContext } from "svelte";
	import { getData } from "../data";
	import {
		Grid,
		ContextMenu,
		defaultMenuOptions,
		type IApi,
	} from "@svar-ui/svelte-grid";
	import type { IMenuOptionClick } from "@svar-ui/svelte-menu";
	import type { IDemoHelpers } from "../types";

	const { data, flexibleColumns: columns } = getData();

	// take the grid's default option set and alter it:
	// drop copy/cut/paste, then append our own options
	const options = [
		...defaultMenuOptions.filter(
			op =>
				!["copy-row", "cut-row", "paste-row"].includes(op.id as string)
		),
		{ comp: "separator" },
		{ id: "info", text: "Row info", icon: "wxi-alert" },
		{ id: "view", text: "View details", icon: "wxi-external" },
	];

	const helpers = getContext<IDemoHelpers>("wx-helpers");

	// built-in options (add/delete/move...) are executed by the grid itself;
	// here we only react to the custom options we added above
	const handleClicks = (ev: IMenuOptionClick) => {
		const option = ev.action;
		if (!option) return;

		if (option.id === "info" || option.id === "view") {
			const id = grid!.getState().selectedRows![0];
			const row = id ? grid!.getRow(id) : null;
			helpers.showNotice({
				text: row
					? `${option.text} — ${row.firstName} ${row.lastName}`
					: `${option.text} clicked`,
			});
		}
	};

	let grid = $state<IApi>();
</script>

<div style="padding: 20px;">
	<h4>Context menu with customized options</h4>
	<ContextMenu api={grid} {options} onclick={handleClicks}>
		<Grid {data} {columns} bind:this={grid} multiselect reorder />
	</ContextMenu>
</div>
