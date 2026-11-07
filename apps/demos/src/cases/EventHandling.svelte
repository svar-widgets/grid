<script lang="ts">
	import { Field, Switch, Button } from "@svar-ui/svelte-core";
	import { EventResolver } from "@svar-ui/lib-state";
	import { RestDataProvider } from "@svar-ui/grid-data-provider";

	import { getContext } from "svelte";
	import { getBackend } from "../data";
	import { Grid, type IApi, type IRow } from "@svar-ui/svelte-grid";

	import type { IDemoHelpers } from "../types";
	const { columns } = getBackend();
	const helpers = getContext<IDemoHelpers>("wx-helpers");
	let blockSelect = $state(false);
	let kapi: IApi;

	let data = $state<IRow[]>([]);
	const provider = new RestDataProvider<IRow>(
		"https://grid-backend.svar.dev/films",
		(o: IRow) => o
	);
	provider.getData().then(v => (data = v));

	async function addRow() {
		const ev = await kapi.exec("add-row", {
			row: {},
			done: (ev: { row: IRow }) => {
				helpers.showNotice({ text: "row added, id:" + ev.row.id });
			},
		});
		helpers.showNotice({ text: "[add] finish, server:" + ev.response.id });
	}

	async function deleteRow() {
		await kapi.exec("delete-row", {
			id: kapi.getState().selectedRows![0],
			done: () => {
				helpers.showNotice({ text: "[delete] store" });
			},
		});
		helpers.showNotice({ text: "[delete] finish" });
	}

	function init(api: IApi) {
		// add a catch for the event fulfillment
		api.setNext(new EventResolver("done")).setNext(provider);

		//selection handlers
		api.on("select-row", log("[select] on"));
		api.intercept("select-row", () => {
			if (blockSelect) return false;
			else log("[select] intercept")();
		});

		api.on("add-row", log("[add] on"));
		api.intercept("add-row", log("[add] intercept"));

		api.on("delete-row", log("[delete] on"));
		api.intercept("delete-row", log("[delete] intercept"));

		kapi = api;
	}

	function log(text: string) {
		return () => helpers.showNotice({ text });
	}
</script>

<div style="padding: 20px;">
	<div>
		<Field label="Prevent selection after adding">
			<Switch bind:value={blockSelect} />
		</Field>
		<Button onclick={addRow} type="primary">Add row</Button>
		<Button onclick={deleteRow}>Delete row</Button>
		<hr />

		<Grid
			{init}
			{data}
			{columns}
			onselectrow={log("[select] handler")}
			onaddrow={log("[add] handler")}
			ondeleterow={log("[delete] handler")}
		/>
	</div>
</div>
