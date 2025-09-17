<script>
	import { getRenderValue } from "@svar-ui/grid-store";

	let { content: Content = null, api, children } = $props();

	let area;
	let tooltipNode = $state();
	let areaCoords = $state();
	let tooltipData = $state();
	let pos = $state();

	function findAttribute(node) {
		while (node) {
			if (node.getAttribute) {
				const id = node.getAttribute("data-row-id");
				const colId = node.getAttribute("data-col-id");
				if (id && api && colId) {
					const col = api.getColumn(colId);
					return { id, col, target: node };
				}
			}
			node = node.parentNode;
		}
		return { id: null, col: null, target: null };
	}

	$effect(() => {
		if (tooltipNode) {
			let tooltipCoords = tooltipNode.getBoundingClientRect();
			if (tooltipCoords.right >= areaCoords.right) {
				pos.left = areaCoords.width - tooltipCoords.width - 5;
			}
			if (tooltipCoords.bottom >= areaCoords.bottom) {
				pos.top -= tooltipCoords.bottom - areaCoords.bottom + 2;
			}
		}
	});

	let timer;
	const TIMEOUT = 300;
	const debounce = code => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			code();
		}, TIMEOUT);
	};
	function move(e) {
		let { id, target, col } = findAttribute(e.target);
		pos = null;
		if (!id) {
			clearTimeout(timer);
			return;
		}
		debounce(() => {
			let text = "";
			if (id) {
				tooltipData = getTooltipData(id);
				text = getTooltipText(col);
			}
			let targetCoords = target.getBoundingClientRect();
			areaCoords = area.getBoundingClientRect();
			const top = targetCoords.top + targetCoords.height - areaCoords.top;
			const left = e.clientX - areaCoords.left;
			pos = { top, left, col, text };
		});
	}

	function getTooltipData(id) {
		return api.getRow(id);
	}

	function getTooltipText(col) {
		if (typeof col.tooltip === "function") return col.tooltip(tooltipData);
		return getRenderValue(tooltipData, col) || "";
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="wx-area" bind:this={area} onmousemove={move}>
	{#if pos && pos.col.tooltip !== false && (Content || pos.text)}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div
			class="tooltip"
			role="alert"
			tabindex="0"
			bind:this={tooltipNode}
			style="top:{pos.top}px;left:{pos.left}px"
		>
			{#if Content}
				<Content data={tooltipData} />
			{:else}{pos.text}{/if}
		</div>
	{/if}
	{@render children()}
</div>

<style>
	.wx-area {
		position: relative;
		height: 100%;
		width: 100%;
	}
	:global(.tooltip) {
		padding: 2px 10px;
		border-radius: 2px;
		box-shadow: var(--wx-box-shadow);
		pointer-events: none;
		position: absolute;
		z-index: 10;
		font-size: var(--wx-font-size-sm);
		font-family: var(--wx-font-family);
		color: var(--wx-color-primary-font);
		background-color: #1a1e21;
	}
</style>
