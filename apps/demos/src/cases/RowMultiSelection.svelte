<script lang="ts">
	import { Grid, type IColumnConfig, type IApi } from "@svar-ui/svelte-grid";
	import type { TID } from "@svar-ui/lib-state";

	import { getData } from "../data";
	const { data } = getData();

	const columns: IColumnConfig[] = [
		{ id: "id", width: 50 },
		{ id: "city", header: "City", width: 160 },
		{ id: "firstName", header: "First Name" },
		{ id: "lastName", header: "Last Name" },
		{ id: "companyName", header: "Company" },
	];

	let api = $state<IApi>(),
		s = $state<TID[]>([]);
	const updateSelected = () => (s = api!.getState().selectedRows!);
</script>

<div style="padding: 20px;">
	<h4>
		Click cells using Ctrl/Shift keys. Selected:
		{s.length ? s.join(", ") : "none"}
	</h4>
	<div>
		<Grid
			{data}
			{columns}
			multiselect={true}
			bind:this={api}
			onselectrow={updateSelected}
		/>
	</div>
</div>
