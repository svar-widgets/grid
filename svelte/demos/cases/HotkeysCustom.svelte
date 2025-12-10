<script>
	import { Grid } from "../../src";
	import { getData } from "../data";

	const { allData: data, countries, users } = getData();
	let api = $state();

	const hotkeys = {
		"ctrl+alt+n": event => {
			event.preventDefault();
			api.exec("add-row", {
				row: {},
			});
		},
		Delete: event => {
			event.preventDefault();
			const id = api.getState().selectedRows[0];
			if (id) {
				api.exec("delete-row", { id });
			}
		},
	};

	const columns = [
		{
			id: "firstName",
			header: 'Name - "text"',
			editor: "text",
			width: 180,
		},
		{
			id: "country",
			header: 'Country - "combo"',
			editor: {
				type: "combo",
				config: { template: option => `${option.id}. ${option.label}` },
			},
			options: countries,
			width: 180,
		},
		{
			id: "date",
			header: 'Date - "datepicker"',
			width: 180,
			editor: "datepicker",
			template: v => (v ? v.toLocaleDateString() : ""),
		},
		{
			id: "user",
			header: 'User - "richselect"',
			width: 180,
			editor: "richselect",
			options: users,
		},
	];
</script>

<div style="padding: 20px;">
	<h4>You can specify your own hotkeys</h4>
	<p>Press ctrl+alt+n to add row, select and press Delete to delete row</p>
	<div>
		<Grid {data} bind:this={api} {columns} {hotkeys} />
	</div>
</div>
