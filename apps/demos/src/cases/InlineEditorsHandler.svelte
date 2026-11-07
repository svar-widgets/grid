<script lang="ts">
	import { Grid, type IColumnConfig } from "@svar-ui/svelte-grid";
	import { getData } from "../data";

	const { data, countries } = getData();

	const properties: Record<string, any> = {
		firstName: "text",
		lastName: "text",
		id: null,
		email: "text",
		companyName: "text",
		country: {
			type: "combo",
			config: {
				template: (option: { label: string }) => option.label,
				options: countries,
			},
		},
		date: "datepicker",
		city: "text",
		street: "text",
		address: "text",
		zipCode: "text",
		followers: "text",
		stars: "text",
		phone: "text",
		details: "text",
	};

	const row = data[0];
	const userData = Object.keys(properties).map(key => ({
		id: key,
		property: key,
		value: row[key],
	}));

	const columns: IColumnConfig[] = [
		{ id: "property", header: "Property", width: 200 },
		{
			id: "value",
			header: "Value",
			width: 270,
			editor: row => properties[row!.id],
			template: (v, row) => {
				if (row.id === "country")
					return countries.find(c => c.id === v)!.label || v;
				return v instanceof Date ? v.toLocaleDateString() : v;
			},
		},
	];
</script>

<div style="padding: 20px;">
	<h4>Editable cells: different cell editors for the "Value" column</h4>
	<div>
		<Grid data={userData} {columns} />
	</div>
</div>
