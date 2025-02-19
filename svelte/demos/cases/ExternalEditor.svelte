<script>
	import {
		RichSelect,
		Switch,
		DatePicker,
		MultiCombo,
	} from "wx-svelte-core";
	import { Editor, registerEditorItem } from "wx-svelte-editor";

	import { Grid, getEditorConfig } from "../../src";
	import { getData } from "../data";
	const { allData: data, countries, users } = getData();

	let api = $state();

	const columns = [
		{ id: "id", width: 50 },
		{
			id: "firstName",
			header: "Name",
			editor: "text",
			width: 160,
		},
		{
			id: "country",
			header: "Country",
			editor: "richselect",
			options: countries,
			width: 160,
		},
		{
			id: "checked",
			hidden: true,
			header: "Active",
			editor: "switch",
			width: 160,
		},
		{
			id: "newsletter",
			header: "Newsletter",
			editor: "checkbox",
			width: 100,
			template: v => (v ? "yes" : "no"),
		},
		{
			id: "date",
			header: "Date",
			width: 100,
			editor: "datepicker",
			template: v => (v ? v.toLocaleDateString() : ""),
		},
		{
			id: "assigned",
			header: "Users",
			width: 100,
			editor: "multicombo",
			options: users,
		},
		{
			id: "companyName",
			header: "Description",
			editor: "textarea",
			flexgrow: 1,
		},
	];

	// Here are sections
	registerEditorItem("richselect", RichSelect);
	registerEditorItem("switch", Switch);
	registerEditorItem("datepicker", DatePicker);
	registerEditorItem("multicombo", MultiCombo);

	let dataToEdit = $state(null);
	const init = api => {
		api.intercept("open-editor", ({ id }) => {
			dataToEdit = api.getRow(id);
			return false;
		});
		api.on("select-row", ({ id }) => {
			if (dataToEdit) {
				dataToEdit = id ? api.getRow(id) : null;
			}
		});
	};
</script>

<div style="padding: 20px;">
	<h4>Grid - dbl-click to show external editor</h4>
	<div style="height: 320px; max-width: 800px;">
		<Grid {data} {columns} bind:this={api} {init} />
	</div>
	{#if dataToEdit}
		<Editor
			values={dataToEdit}
			items={getEditorConfig(columns)}
			topBar={{
				items: [
					{
						comp: "icon",
						icon: "wxi-close",
						id: "close",
					},
					{ comp: "spacer" },
					{
						comp: "button",
						type: "danger",
						text: "Delete",
						id: "delete",
					},
					{
						comp: "button",
						type: "primary",
						text: "Save",
						id: "save",
					},
				],
			}}
			placement="sidebar"
			onsave={({ values }) => {
				api.exec("update-row", {
					id: dataToEdit.id,
					row: values,
				});
			}}
			onaction={({ item }) => {
				if (item.id === "delete")
					api.exec("delete-row", { id: dataToEdit.id });
				if (item.comp) dataToEdit = null;
			}}
		/>
	{/if}
</div>
