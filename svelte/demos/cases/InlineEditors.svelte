<script>
	import { Grid } from "../../src";
	import { getData } from "../data";

	const { allData: data, countries, users } = getData();

	const columns = [
		{ id: "id", width: 50 },
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
	<h4>
		Editable cells: use double click to activate an editor. Use Tab, Enter
		and Esc to navigate
	</h4>
	<div>
		<Grid {data} {columns} />
	</div>
</div>
