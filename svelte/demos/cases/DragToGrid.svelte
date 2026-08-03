<script>
	import { Grid } from "../../src/";
	import { getData } from "../data";
	import { locateID } from "@svar-ui/lib-dom";

	const { countries } = getData();

	// columns shown in the grid (country renders its label via options)
	const columns = [
		{ id: "id", width: 50, header: "ID" },
		{ id: "firstName", header: "First Name", width: 150 },
		{ id: "lastName", header: "Last Name", width: 150 },
		{ id: "country", options: countries, header: "Country", width: 120 },
		{ id: "email", header: "Email", flexgrow: 1 },
	];

	// start with a couple of rows so there is something to drop onto
	const data = [
		{
			id: 1,
			firstName: "Ernest",
			lastName: "Schuppe",
			country: 6,
			email: "Leora13@yahoo.com",
		},
		{
			id: 2,
			firstName: "Janis",
			lastName: "Vandervort",
			country: 4,
			email: "Mose_Gerhold51@yahoo.com",
		},
		{
			id: 3,
			firstName: "Makenzie",
			lastName: "Bode",
			country: 3,
			email: "Frieda.Sauer61@gmail.com",
		},
	];

	// cards available to drag into the grid (no id - assigned on add)
	const cards = [
		{
			firstName: "Aurelie",
			lastName: "Fadel",
			country: 5,
			email: "Aurelie.Fadel@gmail.com",
		},
		{
			firstName: "Marcus",
			lastName: "Konopelski",
			country: 1,
			email: "Marcus_K@yahoo.com",
		},
		{
			firstName: "Dorthy",
			lastName: "Hyatt",
			country: 3,
			email: "Dorthy.Hyatt@hotmail.com",
		},
		{
			firstName: "Lukas",
			lastName: "Brakus",
			country: 4,
			email: "Lukas.Brakus@gmail.com",
		},
	];

	const countryById = Object.fromEntries(countries.map(c => [c.id, c]));

	let api = $state();
	let dropTargetId = $state(null);

	const rowStyle = row => (row.id === dropTargetId ? "wx-drop-target" : "");

	function onCardDragStart(ev, card) {
		ev.dataTransfer.setData("application/json", JSON.stringify(card));
		ev.dataTransfer.effectAllowed = "copy";
	}

	function onGridDragOver(ev) {
		// allow drop
		ev.preventDefault();
		ev.dataTransfer.dropEffect = "copy";

		dropTargetId = locateID(ev, "data-id");
	}

	function onGridDragLeave(ev) {
		// only clear when the cursor actually leaves the wrapper
		if (!ev.currentTarget.contains(ev.relatedTarget)) dropTargetId = null;
	}

	function onGridDrop(ev) {
		ev.preventDefault();

		const raw = ev.dataTransfer.getData("application/json");
		if (!raw) return;
		const row = JSON.parse(raw);

		api.exec(
			"add-row",
			dropTargetId != null ? { row, after: dropTargetId } : { row }
		);

		dropTargetId = null;
	}
</script>

<div class="demo">
	<div class="cards">
		<h4>Contacts</h4>
		<p class="hint">Drag a card onto the grid to add it as a row.</p>
		{#each cards as card (card.email)}
			<div
				class="card"
				draggable="true"
				ondragstart={ev => onCardDragStart(ev, card)}
				role="listitem"
			>
				<div class="card-name">
					{card.firstName}
					{card.lastName}
				</div>
				<div class="card-meta">
					<span>{countryById[card.country]?.flag}</span>
					<span>{countryById[card.country]?.label}</span>
				</div>
				<div class="card-email">{card.email}</div>
			</div>
		{/each}
	</div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="grid-box"
		ondragover={onGridDragOver}
		ondragleave={onGridDragLeave}
		ondrop={onGridDrop}
	>
		<Grid bind:this={api} {data} {columns} {rowStyle} />
	</div>
</div>

<style>
	.demo {
		display: flex;
		gap: 20px;
		padding: 20px;
		height: 440px;
		box-sizing: border-box;
	}
	.cards {
		width: 240px;
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		gap: 10px;
		overflow: auto;
	}
	.cards h4 {
		margin: 0;
	}
	.hint {
		margin: 0 0 4px;
		font-size: 13px;
		color: var(--wx-color-font-alt);
	}
	.card {
		border: var(--wx-border);
		border-radius: 6px;
		padding: 10px 12px;
		background: var(--wx-background);
		color: var(--wx-color-font);
		cursor: grab;
		box-shadow: var(--wx-shadow-light);
		user-select: none;
	}
	.card:active {
		cursor: grabbing;
	}
	.card-name {
		font-weight: 600;
	}
	.card-meta {
		display: flex;
		gap: 6px;
		font-size: 13px;
		color: var(--wx-color-font-alt);
		margin-top: 2px;
	}
	.card-email {
		font-size: 12px;
		color: var(--wx-color-font-alt);
		margin-top: 2px;
	}
	.grid-box {
		flex: 1 1 auto;
		min-width: 0;
	}

	/* class lands on grid-owned .wx-row, so target it globally */
	:global(.wx-row.wx-drop-target) {
		background: var(--wx-color-secondary-hover);
		box-shadow: inset 0 0 0 2px var(--wx-color-primary);
	}
</style>
