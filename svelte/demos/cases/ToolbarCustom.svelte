<script>
	import { getContext } from "svelte";
	import { getData } from "../data";
	import {
		Grid,
		Toolbar,
		defaultToolbarButtons,
		getEditorConfig,
	} from "../../src";
	import { Editor, registerEditorItem } from "@svar-ui/svelte-editor";
	import { RichSelect, DatePicker } from "@svar-ui/svelte-core";

	const helpers = getContext("wx-helpers");
	const { data, countries } = getData();
	let api = $state();
	let dataToEdit = $state(null);

	const columns = [
		{ id: "id", width: 50 },
		{
			id: "firstName",
			header: "First Name",
			editor: "text",
			width: 160,
		},
		{
			id: "lastName",
			header: "Last Name",
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
			id: "date",
			header: "Date",
			width: 100,
			editor: "datepicker",
			template: v => (v ? v.toLocaleDateString() : ""),
		},
		{
			id: "companyName",
			header: "Description",
			editor: "textarea",
			flexgrow: 1,
		},
	];

	registerEditorItem("richselect", RichSelect);
	registerEditorItem("datepicker", DatePicker);

	// filter default buttons
	const outButtons = ["copy-row", "cut-row", "paste-row"];
	const items = defaultToolbarButtons.filter(b => {
		return !outButtons.includes(b.id);
	});

	items.splice(1, 0, {
		id: "my-action",
		comp: "icon",
		icon: "wxi-cat",
	});

	function handleClick(ev) {
		if (ev.item.id === "my-action") {
			helpers.showNotice({ text: "'My action' clicked" });
		}
	}

	function init(obj) {
		api = obj;

		api.intercept("open-editor", () => {
			const id = api.getState().selectedRows[0];
			if (id) dataToEdit = api.getRow(id);
			return false;
		});
	}
</script>

<div style="padding: 20px;">
	<Toolbar {api} {items} onclick={handleClick} />
	<Grid {data} {columns} {init} undo />
</div>
{#if dataToEdit}
	<Editor
		values={dataToEdit}
		items={getEditorConfig(columns)}
		placement="sidebar"
		onsave={({ values }) => {
			api.exec("update-row", {
				id: dataToEdit.id,
				row: values,
			});
		}}
		onaction={() => (dataToEdit = null)}
	/>
{/if}
