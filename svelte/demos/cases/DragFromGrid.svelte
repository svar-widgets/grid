<script>
	import { Grid } from "../../src/";
	import { getData } from "../data";
	import { locateID } from "@svar-ui/lib-dom";

	const { allData, countries } = getData();

	const columns = [
		{ id: "id", width: 50, header: "ID" },
		{ id: "firstName", header: "First Name", width: 150 },
		{ id: "lastName", header: "Last Name", width: 150 },
		{ id: "country", options: countries, header: "Country", width: 120 },
		{ id: "email", header: "Email", flexgrow: 1 },
	];

	const data = allData.slice(0, 12);
	const countryById = Object.fromEntries(countries.map(c => [c.id, c]));

	let api = $state();
	let droppedCards = $state([]);
	let boxActive = $state(false);

	function onGridDragStart(ev) {
		const id = locateID(ev, "data-id");
		if (id == null) return;

		const row = api.getRow(id);
		ev.dataTransfer.setData("application/json", JSON.stringify(row));
		ev.dataTransfer.effectAllowed = "copy";
	}

	function onBoxDragOver(ev) {
		ev.preventDefault();
		ev.dataTransfer.dropEffect = "copy";
		boxActive = true;
	}

	function onBoxDragLeave(ev) {
		if (!ev.currentTarget.contains(ev.relatedTarget)) boxActive = false;
	}

	function onBoxDrop(ev) {
		ev.preventDefault();
		boxActive = false;

		const raw = ev.dataTransfer.getData("application/json");
		if (!raw) return;

		// copy - source row stays in the grid
		droppedCards = [...droppedCards, JSON.parse(raw)];
	}
</script>

<div class="demo">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="grid-box" ondragstart={onGridDragStart}>
		<Grid bind:this={api} {data} {columns} draggableRows />
	</div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="drop-box"
		class:active={boxActive}
		ondragover={onBoxDragOver}
		ondragleave={onBoxDragLeave}
		ondrop={onBoxDrop}
	>
		<h4>Dropped here</h4>
		{#if droppedCards.length === 0}
			<p class="empty">Drag a row from the grid and drop it here.</p>
		{:else}
			{#each droppedCards as card, i (i)}
				<div class="card">
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
		{/if}
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
	.grid-box {
		flex: 1 1 auto;
		min-width: 0;
	}
	/* hint that rows can be grabbed */
	.grid-box :global(.wx-row) {
		cursor: grab;
	}
	.drop-box {
		width: 260px;
		flex: 0 0 auto;
		border: 2px dashed var(--wx-color-font-alt);
		border-radius: 8px;
		padding: 12px;
		overflow: auto;
		display: flex;
		flex-direction: column;
		gap: 10px;
		background: var(--wx-background-alt);
		transition:
			border-color 0.15s,
			background 0.15s;
	}
	.drop-box.active {
		border-color: var(--wx-color-primary);
		background: var(--wx-color-secondary-hover);
	}
	.drop-box h4 {
		margin: 0;
	}
	.empty {
		margin: 0;
		font-size: 13px;
		color: var(--wx-color-font-alt);
	}
	.card {
		border: var(--wx-border);
		border-radius: 6px;
		padding: 10px 12px;
		background: var(--wx-background);
		color: var(--wx-color-font);
		box-shadow: var(--wx-shadow-light);
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
</style>
