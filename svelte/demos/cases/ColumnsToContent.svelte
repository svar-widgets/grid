<script>
	import { Grid } from "../../src";

	import { getData } from "../data";
	const { data, treeData, treeColumns } = getData();
	delete treeColumns[0].flexgrow;

	const columns = [
		{ id: "id", width: 50 },
		{ id: "firstName", header: "First Name" },
		{ id: "lastName", header: "Last Name", editor: "text" },
		{ id: "email", header: "Email", editor: "text" },
		{
			id: "companyName",
			header: "Company - long column name could be here",
			editor: "text",
		},
		{
			id: "street",
			header: "Street",
			template: v => v + " street",
		},
	];

	let api1, api2;
	function resizeColumns() {
		api1.exec("resize-column", { id: "email", auto: "data" });
		api1.exec("resize-column", { id: "lastName", auto: "header" });
		api1.exec("resize-column", {
			id: "companyName",
			auto: true,
			maxRows: 20,
		});
		api1.exec("resize-column", { id: "street", auto: true });
	}

	function resizeTreeColumns() {
		api2.exec("resize-column", { id: "lastName", auto: "data" });
		api2.exec("resize-column", { id: "firstName", auto: "header" });
		api2.exec("resize-column", { id: "city", auto: true });
	}

	const init = api => {
		api1 = api;
		resizeColumns();
	};

	const treeInit = api => {
		api2 = api;
		resizeTreeColumns();
	};
</script>

<div style="padding: 20px;">
	<h3>Basic mode</h3>
	<h4>"Last Name" column is adjusted to header text</h4>
	<h4>"Email" column is adjusted to data</h4>
	<h4>"Company" column is adjusted to both data and header text</h4>
	<Grid {data} {columns} {init} onupdatecell={() => resizeColumns()} />
</div>

<div style="padding: 20px;">
	<h3>Tree mode</h3>
	<h4>"Last Name" column is adjusted to data</h4>
	<h4>"First Name" column is adjusted to header</h4>
	<h4>"City" column is adjusted to both data and header text</h4>
	<Grid
		init={treeInit}
		tree={true}
		data={treeData}
		columns={treeColumns}
		onupdatecell={() => resizeTreeColumns()}
	/>
</div>
