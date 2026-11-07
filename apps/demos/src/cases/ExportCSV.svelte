<script lang="ts">
	import { Grid, type IApi } from "@svar-ui/svelte-grid";
	import { Button } from "@svar-ui/svelte-core";

	import { getData } from "../data";
	const { clientData, clientColumns, treeData, treeFixedColumns } = getData();

	let api1 = $state<IApi>(),
		api2 = $state<IApi>();

	function exportCsv(api: IApi) {
		api.exec("export-data", {
			format: "csv",
			fileName: "clients",
			csv: {
				cols: ";",
			},
		});
	}
</script>

<div style="padding: 20px;">
	<p>
		<Button type="primary" onclick={() => exportCsv(api1!)}>
			Export to CSV
		</Button>
	</p>
	<div style="max-width: 800px;">
		<Grid
			footer={true}
			data={clientData}
			columns={clientColumns}
			bind:this={api1}
		/>
	</div>
</div>

<div style="padding: 20px;">
	<p>
		<Button type="primary" onclick={() => exportCsv(api2!)}
			>Export to CSV</Button
		>
	</p>
	<div style="max-width: 800px;">
		<Grid
			bind:this={api2}
			tree={true}
			data={treeData}
			columns={treeFixedColumns}
			footer={true}
		/>
	</div>
</div>
