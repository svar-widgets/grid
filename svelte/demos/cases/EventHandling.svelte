<script>
	import { Field, Switch, Button } from "wx-svelte-core";
	import { EventResolver } from "wx-lib-state";
	import { RestDataProvider } from "wx-grid-data-provider";

	import { getContext } from "svelte";
	import { getBackend } from "../data";
	import { Grid } from "../../src";

	const { columns } = getBackend();
	const helpers = getContext("wx-helpers");
	let blockSelect = false;
	let kapi;

	let data = [];
	const provider = new RestDataProvider(
		"https://master--table-go--dev.webix.io/films",
		o => o
	);
	provider.getData().then(v => (data = v));

	async function addRow() {
		const ev = await kapi.exec("add-row", {
			row: {},
			done: ev => {
				helpers.showNotice({ text: "row added, id:" + ev.row.id });
			},
		});
		helpers.showNotice({ text: "[add] finish, server:" + ev.response.id });
	}

	async function deleteRow() {
		await kapi.exec("delete-row", {
			id: kapi.getState().selected,
			done: () => {
				helpers.showNotice({ text: "[delete] store" });
			},
		});
		helpers.showNotice({ text: "[delete] finish" });
	}

	function init(api) {
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

	function log(text) {
		return () => helpers.showNotice({ text });
	}
</script>

<div style="padding: 20px;">
	<div>
		<Field label="Prevent selection after adding">
			<Switch bind:value={blockSelect} />
		</Field>
		<Button click={addRow} type="primary">Add row</Button>
		<Button click={deleteRow}>Delete row</Button>
		<hr />

		<Grid
			{init}
			{data}
			{columns}
			on:select-row={log("[select] handler")}
			on:add-row={log("[add] handler")}
			on:delete-row={log("[delete] handler")}
		/>
	</div>
</div>
