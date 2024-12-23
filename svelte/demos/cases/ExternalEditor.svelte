<script>
	import {
		RichSelect,
		Switch,
		Checkbox,
		DatePicker,
		Area,
	} from "wx-svelte-core";
	import { Panel, registerFormItem } from "wx-svelte-form";

	import { Grid, editorConfig } from "../../src";
	import { getData } from "../data";
	const { allData: data, countries, users } = getData();

	let api = $state();

	const columns = [
		{ id: "id", width: 30 },
		{ id: "firstName", header: "Name", editor: "text", width: 160 },
		{
			id: "country",
			header: "Country",
			editor: "combo",
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
			header: "Comments",
			editor: "textarea",
			flexgrow: 1,
		},
	];

	// Here are sections
	registerFormItem("combo", RichSelect);
	registerFormItem("switch", Switch);
	registerFormItem("checkbox", Checkbox);
	registerFormItem("datepicker", DatePicker);
	registerFormItem("textarea", Area);

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
		api.on("close-editor", () => {
			dataToEdit = null;
		});
	};
</script>

<div style="padding: 20px;">
	<h4>Grid - dbl-click to show editor</h4>
	<div style="height: 320px; max-width: 800px;">
		<Grid {data} {columns} bind:this={api} {init} />
	</div>
	{#if dataToEdit}
		<Panel
			data={dataToEdit}
			config={{ placement: "sidebar", autoSave: true }}
			sections={editorConfig(columns)}
			onupdate={e => {
				const { changes, data } = e;
				changes.forEach(key => {
					api.exec("update-cell", {
						id: dataToEdit.id,
						column: key,
						value: data[key],
					});
				});
			}}
			ontoolbar={e => {
				const id = e.id;
				if (id === "close" || id === "save" || id === "cancel")
					api.exec("close-editor", { ignore: id === "cancel" });
			}}
		/>
	{/if}
</div>
