<script>
	import { RichSelect } from "wx-svelte-core";
	import { Editor, registerEditorItem } from "wx-svelte-editor";
	import { Tasklist } from "wx-svelte-tasklist";

	import { Grid, getEditorConfig } from "../../src";
	import { getData } from "../data";

	const { allData: data, countries } = getData();
	data.forEach((d, i) => {
		d.tasks = !i
			? [
					{
						id: 1,
						content:
							"Research best practices for integrating third-party libraries with React",
						status: 1,
					},
					{
						id: 2,
						content:
							"Explore modern approaches to building applications using React",
						status: 0,
					},
					{
						id: 3,
						content:
							"Explore different methods for integrating React with existing JavaScript frameworks",
						status: 0,
					},
					{
						id: 4,
						date: new Date(),
						content:
							"Learn about routing in React using React Router",
						status: 1,
					},
					{
						id: 5,
						content:
							"Understand principles and best practices for component development in React",
						status: 0,
					},
					{
						id: 6,
						content:
							"Explore different methods for integrating React with existing JavaScript frameworks",
						status: 0,
					},
					{
						id: 7,
						content: "Optimize performance in React applications",
						status: 0,
					},
					{
						id: 8,
						content:
							"Work with API requests and data handling in React applications",
						status: 0,
					},
				]
			: [];
	});

	const columns = [
		{ id: "id", width: 50 },
		{
			id: "firstName",
			header: "Name",
			editor: {
				type: "text",
				label: "First name",
				config: {
					placeholder: "Enter first name",
				},
			},
			width: 160,
		},
		{
			id: "country",
			header: "Country",
			editor: "combo",
			options: countries,
			width: 160,
		},
		{
			id: "email",
			header: "Email",
			width: 160,
		},
		{
			id: "date",
			header: "Date",
			width: 160,
			template: v => (v ? v.toLocaleDateString() : ""),
		},
		{
			id: "companyName",
			header: "Company",
		},
		{
			id: "tasks",
			header: "Tasks",
			editor: {
				type: "tasks",
			},
			template: v => {
				const total = v.length;
				if (!total) return "0 tasks";
				const completed = v.filter(t => t.status).length;
				return `${total} ${total == 1 ? "task" : "tasks"}, ${completed} completed`;
			},
		},
	];

	// Here are sections
	registerEditorItem("combo", RichSelect);
	registerEditorItem("tasks", Tasklist);

	// Editor config
	const items = getEditorConfig(columns);

	let dataToEdit = $state(null);
	let api = $state();
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
	<h4>Grid - dbl-click to show external editor with tasks list</h4>
	<div style="height: 400px;">
		<Grid {data} {columns} bind:this={api} {init} />
	</div>
	{#if dataToEdit}
		<Editor
			values={dataToEdit}
			{items}
			placement="sidebar"
			autoSave={true}
			onchange={({ key, value }) => {
				api.exec("update-cell", {
					id: dataToEdit.id,
					column: key,
					value,
				});
			}}
			onaction={({ item }) => {
				if (item.comp) dataToEdit = null;
			}}
		/>
	{/if}
</div>
