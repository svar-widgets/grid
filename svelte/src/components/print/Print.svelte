<script>
	import { getContext, onMount } from "svelte";
	import Grid from "./Grid.svelte";
	import { getPrintColumns } from "@svar-ui/grid-store";

	let { config, ...restProps } = $props();

	const api = getContext("grid-store");
	const { _skin: skin, _columns: columns } = api.getState();

	let grids = getPrintColumns(columns, config);
	let node = $state();

	onMount(() => {
		const target = document.body;
		target.classList.add("wx-print");

		const cloned = node.cloneNode(true);
		target.appendChild(cloned);

		const rule = `@media print { @page { size: ${config.paper} ${config.mode}; }`;
		const style = document.createElement("style");
		style.setAttribute("type", "text/css");
		style.setAttribute("media", "print");
		document.getElementsByTagName("head")[0].appendChild(style);
		style.appendChild(document.createTextNode(rule));

		window.print();

		style.remove();
		target.classList.remove("wx-print");

		cloned.remove();
	});
</script>

<div class="wx-{skin}-theme wx-print-container" bind:this={node}>
	{#each grids as cols}
		<div class="wx-print-grid-wrapper">
			<Grid columns={cols} {...restProps} />
		</div>
	{/each}
</div>

<style>
	:global(.wx-print-container) {
		display: none;
	}

	:global(.wx-print-grid) {
		border-collapse: collapse;
		table-layout: fixed;
		border: var(--wx-table-border);
		border-spacing: 0;
		text-indent: initial;
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact;
	}

	:global(.wx-print-grid tr, .wx-print-grid th, .wx-print-grid td) {
		border: var(--wx-table-border);
	}

	@media print {
		:global(.wx-print > *) {
			display: none;
		}

		:global(.wx-print-container > .wx-print-grid-wrapper) {
			page-break-after: always;
			break-after: page;
		}

		:global(.wx-print-container) {
			display: block;
		}
	}
</style>
