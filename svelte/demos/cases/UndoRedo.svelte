<script>
	import { Button } from "wx-svelte-core";
	import { getData } from "../data";
	import { Grid, HeaderMenu, ContextMenu } from "../../src";

	const { data } = getData();

	let api = $state();
	let history = $derived(api?.getReactiveState().history);

	const columns = [
		{ id: "id", width: 50 },
		{
			id: "firstName",
			header: "First Name",
			footer: "First Name",
			editor: "text",
			width: 150,
		},
		{
			id: "lastName",
			header: "Last Name",
			footer: "Last Name",
			editor: "text",
			width: 150,
		},
		{
			id: "email",
			header: { text: "Email", collapsible: true },
			footer: "Email",
		},
		{
			id: "companyName",
			header: { text: "Company", collapsible: true },
			footer: "Company",
		},
		{ id: "city", header: "City" },
		{ id: "stars", header: "Stars" },
	];

	columns.forEach(c => (c.resize = true));

	function handleUndo(api) {
		api.exec("undo");
	}
	function handleRedo(api) {
		api.exec("redo");
	}
</script>

<div style="padding: 20px;">
	<div class="buttons" style="margin: 20px 0;">
		<Button
			type="primary"
			onclick={() => handleUndo(api)}
			disabled={history && !$history.undo}>Undo</Button
		>
		<Button
			type="primary"
			onclick={() => handleRedo(api)}
			disabled={history && !$history.redo}>Redo</Button
		>
	</div>
	<div>
		<ContextMenu {api}>
			<HeaderMenu {api}>
				<Grid {data} {columns} bind:this={api} undo reorder />
			</HeaderMenu>
		</ContextMenu>
	</div>
</div>

<style>
	.buttons {
		display: flex;
		gap: 10px;
	}
</style>
