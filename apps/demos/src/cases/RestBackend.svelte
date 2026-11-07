<script lang="ts">
	import { Button } from "@svar-ui/svelte-core";
	import { RestDataProvider } from "@svar-ui/grid-data-provider";
	import {
		Grid,
		type IColumnConfig,
		type IApi,
		type IRow,
	} from "@svar-ui/svelte-grid";

	const columns: IColumnConfig[] = [
		{
			id: "name",
			header: "Title",
			flexgrow: 1,
			sort: true,
			editor: "text",
		},
		{
			id: "year",
			header: "Year",
			width: 100,
			sort: true,
			editor: "text",
		},
		{
			id: "votes",
			header: "Votes",
			width: 100,
			sort: true,
			editor: "text",
		},
	];
	let data = $state<IRow[]>([]);
	const provider = new RestDataProvider<IRow>(
		"https://grid-backend.svar.dev/films",
		(obj: IRow) => {
			obj.year = obj.year * 1;
			obj.votes = obj.votes * 1;
		}
	);
	provider.getData().then(v => (data = v));

	let api = $state<IApi>();
	const deleteRow = () => {
		const id = api!.getState().selectedRows![0];
		if (id) {
			api!.exec("delete-row", { id });
		}
	};
	const addRow = () => {
		api!.exec("add-row", {
			row: { name: "New Film", year: "2022", votes: 1 },
		});
	};
	const init = (api: IApi) => {
		api.setNext(provider);
	};
</script>

<div style="padding: 20px; height: 600px;">
	<div style="padding-bottom: 10px;">
		<Button onclick={addRow} type="primary">Add row</Button>
		<Button onclick={deleteRow}>Delete row</Button>
	</div>

	<Grid {data} {columns} bind:this={api} {init} />
</div>
