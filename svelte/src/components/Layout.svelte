<script>
	import { createEventDispatcher, afterUpdate } from "svelte";
	import { onresize } from "../helpers/actions/onresize";
	import { delegateClick, locateAttr, clickOutside } from "wx-lib-dom";
	import { hotkeys } from "wx-grid-store";
	import { scrollTo } from "wx-grid-store";

	import Cell from "./Cell.svelte";
	import HeaderFooter from "./HeaderFooter.svelte";
	import Overlay from "./Overlay.svelte";
	import Editor from "./inlineEditors/Editor.svelte";

	const dispatch = createEventDispatcher();

	const SCROLLSIZE = getScrollSize();

	export let store;
	export let api;
	export let header;
	export let footer;
	export let overlay;
	export let select;
	export let multiselect;

	export let rowStyle;
	export let columnStyle;
	export let cellStyle;
	export let autoRowHeight;

	const {
		dynamic,
		flatData: data,
		_columns,
		split,
		_sizes,
		selectedRows,
		editor,
		filter,
		scroll,
	} = store.getReactive();

	$: defaultRowHeight = $_sizes.rowHeight;
	let clientWidth = 0,
		clientHeight = 0,
		fullHeight;
	$: {
		const count = $dynamic ? $dynamic.rowsCount : $data.length;
		const base = count * defaultRowHeight;
		if (autoRowHeight) {
			fullHeight =
				renderedHeight +
				deltaTop +
				(count - renderEnd) * defaultRowHeight;
		} else {
			fullHeight = base;
		}
	}

	// mark split columns
	let leftColumns = [],
		centerColumns = [],
		leftWidth = 0;
	$: {
		leftColumns = $_columns.slice(0, $split.left).filter(c => !c.hidden);
		leftWidth = 0;
		leftColumns.forEach(a => {
			a.fixed = 1;
			a.left = leftWidth;
			leftWidth += a.width;
		});

		if (leftColumns.length) leftColumns[leftColumns.length - 1].fixed = -1;

		centerColumns = $_columns.slice($split.left).filter(c => !c.hidden);
		centerColumns.forEach(a => {
			a.fixed = 0;
		});
	}

	// get full width
	let hasAny, fullWidth;
	$: {
		hasAny = false;
		fullWidth = 0;
		$_columns.forEach(col => {
			if (!col.hidden) {
				if (col.flexgrow) {
					hasAny = hasAny || col.flexgrow;
				}
				fullWidth += col.width;
			}
		});
		contentWidth = fullWidth;
	}

	// set global width
	let globalWidth,
		contentWidth,
		hasVScroll = false,
		hasHScroll = false;

	$: hasVScroll =
		clientWidth && clientHeight ? fullHeight > clientHeight : false;
	$: hasHScroll =
		clientWidth && clientHeight ? fullWidth > clientWidth : false;
	$: {
		if (hasAny && fullWidth <= clientWidth) {
			// we have flexible columns
			// ignoring fullWidth as it doesn't include flex columns and has no meaning in this context
			globalWidth = contentWidth = clientWidth;
			contentWidth -= hasVScroll ? SCROLLSIZE : 0;
		} else {
			// we have a fixed width
			if (contentWidth < clientWidth)
				globalWidth = fullWidth + (hasVScroll ? SCROLLSIZE : 0);
			else globalWidth = -1;
		}
	}

	// hom many rows visible
	let visibleRows, visibleRowsHeight;
	$: {
		visibleRowsHeight =
			clientHeight -
			(header ? $_sizes.headerHeight : 0) -
			(footer ? $_sizes.footerHeight : 0) -
			(hasHScroll ? SCROLLSIZE : 0);
		visibleRows = Math.ceil(visibleRowsHeight / defaultRowHeight) + 1;
	}

	// request data if necessary
	const EXTRAROWS = 2;
	let requestData = { row: { start: 0, end: 0 } },
		deltaTop = 0;
	$: {
		let start = 0;
		if (autoRowHeight) {
			let st = scrollTop;
			while (st > 0) {
				st -= rowHeights[start] || defaultRowHeight;
				start++;
			}

			// space to first rendered row
			deltaTop = scrollTop - st;
			for (let i = Math.max(0, start - EXTRAROWS - 1); i < start; i++)
				deltaTop -= rowHeights[start - i] || defaultRowHeight;

			start = Math.max(0, start - EXTRAROWS);
		} else {
			start = Math.floor(scrollTop / defaultRowHeight);
			start = Math.max(0, start - EXTRAROWS);
			deltaTop = start * defaultRowHeight;
		}

		const end = Math.min(
			$dynamic ? $dynamic.rowsCount : $data.length,
			start + visibleRows + EXTRAROWS
		);

		if (start != requestData.row.start || end != requestData.row.end) {
			requestData = { row: { start, end } };
			if ($dynamic) {
				dispatch("data-request", { requestData });
			}
		}
	}

	// get visible rows
	let renderRows = [];
	let renderStart = 0;
	let renderEnd = 0;
	$: {
		if ($dynamic) renderRows = $data;
		else {
			let rows = $data;
			if ($filter) {
				rows = rows.filter($filter);
			}
			renderRows = rows.slice(requestData.row.start, requestData.row.end);
		}

		renderStart = requestData?.row.start;
	}

	// get visible columns
	const EXTRACOLUMNS = 1;
	let renderColumns = [],
		renderColumnsH = [],
		renderColumnsF = [],
		deltaLeft = 0,
		deltaLeftH = 0,
		deltaLeftF = 0;
	let cs, csH, csF, ce;
	$: {
		const left = scrollLeft;
		const right = scrollLeft + clientWidth;

		let start = 0;
		let end = 0;
		let sum = 0;

		deltaLeft = deltaLeftH = deltaLeftF = 0;

		centerColumns.forEach((col, index) => {
			if (left > sum) {
				start = index;
				deltaLeft = deltaLeftH = deltaLeftF = sum;
			}
			sum = sum + col.width;

			if (right > sum) end = index + EXTRACOLUMNS;
		});

		// include visible header/footer spans
		const headerPos = getHeaderPosition(start, deltaLeft, "header");
		const footerPos = getHeaderPosition(start, deltaLeft, "footer");

		deltaLeftH = headerPos.delta;
		csH = headerPos.index;

		deltaLeftF = footerPos.delta;
		csF = footerPos.index;

		cs = start;
		ce = end;
	}

	$: {
		if (hasAny && fullWidth > clientWidth) {
			renderColumns =
				renderColumnsH =
				renderColumnsF =
					[...leftColumns, ...centerColumns];
		} else {
			renderColumns = [
				...leftColumns,
				...centerColumns.slice(cs, ce + 1),
			];
			renderColumnsH = [
				...leftColumns,
				...centerColumns.slice(csH, ce + 1),
			];
			renderColumnsF = [
				...leftColumns,
				...centerColumns.slice(csF, ce + 1),
			];
		}
	}

	let scrollLeft = 0,
		scrollTop = 0;
	function onScroll(ev) {
		scrollTop = ev.target.scrollTop;
		scrollLeft = ev.target.scrollLeft;
	}

	function resize(rect) {
		clientWidth = rect.width;
		clientHeight = rect.height;
	}

	function lockSelection(ev) {
		// we prevent default on mousedown reaction to stop the unwanted text selection
		// in the same time we need to have focus-in, so trigger it manually
		//
		// in future, it will be optimal to block text selection directly, without affecting focus related event
		if (ev.shiftKey) ev.preventDefault();
		focusNode.focus();
	}

	const bodyClickHandlers = {
		dblclick: (id, ev) => {
			const data = { id, column: locateAttr(ev, "data-col-id") };
			dispatch("action", { action: "open-editor", data });
		},
		click: (id, ev) => {
			if (select === false) return;

			const toggle = multiselect && ev.ctrlKey;
			const range = multiselect && ev.shiftKey;
			dispatch("action", {
				action: "select-row",
				data: { id, toggle, range },
			});
		},
		"toggle-row": id => {
			const row = store.getRow(id);
			dispatch("action", {
				action: row.open ? "close-row" : "open-row",
				data: {
					id,
				},
			});
		},
		"ignore-click": () => {
			return false;
		},
	};

	// for header and footer (e.g. type): include visible spans
	function getHeaderPosition(start, deltaLeft, type) {
		let delta = deltaLeft;
		let index = start;

		if (centerColumns.length) {
			let spanStartInd = centerColumns.length; // max value to compare with
			// find min index of the column which colspan is visible
			for (let i = start; i >= 0; i--) {
				const colHeader = centerColumns[i][type];
				colHeader.forEach(h => {
					if (
						h.colspan > 1 &&
						i > start - h.colspan &&
						i < spanStartInd
					) {
						spanStartInd = i;
					}
				});
			}

			if (spanStartInd !== centerColumns.length && spanStartInd < start) {
				for (let i = spanStartInd; i < start; i++) {
					delta -= centerColumns[i].width;
				}
				index = spanStartInd;
			}
		}

		return { index, delta };
	}

	function getScrollSize() {
		const div = document.createElement("div");
		div.style.cssText =
			"position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;min-height:100px;overflow-y:scroll;";
		document.body.appendChild(div);
		const width = div.offsetWidth - div.clientWidth;
		document.body.removeChild(div);
		return width;
	}

	$: style = globalWidth ? `width:${globalWidth}px;` : "";

	let dataEl;
	let rowHeights = [];
	let renderedHeight = 0;
	function adjustHeight() {
		let rh = 0;
		let re = renderStart;
		dataEl.childNodes.forEach((row, i) => {
			rowHeights[renderStart + i] = row.offsetHeight;
			rh += row.offsetHeight;
			re++;
		});

		renderedHeight = rh;
		renderEnd = re;
	}

	if (autoRowHeight)
		afterUpdate(() => {
			adjustHeight();
		});

	let focusNode;
	const resetFocus = e => {
		if (!e && focusNode) {
			focusNode.focus();
			activeTable = true;
		} else activeTable = null;
	};
	$: resetFocus($editor);

	let activeTable = null;
</script>

<div
	class="wx-grid"
	style="--header-height:{header
		? $_sizes.headerHeight
		: 0}px; --footer-height:{footer
		? $_sizes.footerHeight
		: 0}px;--split-left-width:{leftWidth}px;"
>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		bind:this={focusNode}
		class="wx-table-box"
		use:clickOutside={() => (activeTable = null)}
		class:wx-active={activeTable}
		on:click={() => (activeTable = true)}
		use:onresize={resize}
		{style}
		tabindex="0"
		use:hotkeys={{
			keys: {
				tab: true,
				"shift+tab": true,
				arrowup: true,
				arrowdown: true,
				escape: true,
				f2: true,
			},
			exec: v => api.exec("hotkey", v),
		}}
	>
		<div
			class="wx-scroll"
			on:scroll={onScroll}
			use:scrollTo={{
				scroll,
				getWidth: () => clientWidth,
				getHeight: () => visibleRowsHeight,
			}}
		>
			{#if header}
				<div class="wx-header-wrapper">
					<HeaderFooter
						{contentWidth}
						deltaLeft={deltaLeftH}
						rowHeights={$_sizes.headerRowHeights}
						columns={renderColumnsH}
						{columnStyle}
						on:action
					/>
				</div>
			{/if}
			<div
				class="wx-body"
				style="width:{contentWidth}px;height:{fullHeight}px;"
				on:mousedown={ev => lockSelection(ev)}
				use:delegateClick={bodyClickHandlers}
			>
				{#if overlay}
					<Overlay {overlay} on:action />
				{/if}
				<div
					bind:this={dataEl}
					class="wx-data"
					style="padding-top:{deltaTop}px;padding-left:{deltaLeft}px;"
				>
					{#each renderRows as row (row.id)}
						<div
							class:wx-autoheight={autoRowHeight}
							class={"wx-row" +
								(rowStyle ? " " + rowStyle(row) : "")}
							data-id={row.id}
							data-context-id={row.id}
							class:wx-selected={$selectedRows.indexOf(row.id) !==
								-1}
							style={`${autoRowHeight ? "min-height" : "height"}:${defaultRowHeight}px;`}
						>
							{#each renderColumns as col (col.id)}
								{#if col.collapsed}
									<div class="wx-cell wx-collapsed" />
								{:else if $editor?.id === row.id && $editor.column == col.id}
									<Editor editor={$editor} {col} on:action />
								{:else if col.cell}
									<svelte:component
										this={col.cell}
										{api}
										{row}
										{col}
										{columnStyle}
										{cellStyle}
										on:action
									/>
								{:else}
									<Cell
										{row}
										{col}
										{columnStyle}
										{cellStyle}
										on:action
									/>
								{/if}
							{/each}
						</div>
					{/each}
				</div>
			</div>
			{#if footer && $data.length}
				<HeaderFooter
					type={"footer"}
					{contentWidth}
					deltaLeft={deltaLeftF}
					rowHeights={$_sizes.footerRowHeights}
					columns={renderColumnsF}
					{columnStyle}
					on:action
				/>
			{/if}
		</div>
	</div>
</div>

<style>
	.wx-grid {
		height: 100%;
		width: 100%;
	}
	.wx-grid :global(*) {
		scroll-margin-top: var(--header-height);
		scroll-margin-bottom: var(--footer-height);
		scroll-margin-left: var(--split-left-width);
	}
	.wx-table-box {
		outline: none;
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		border: var(--wx-table-cell-border);
		overflow: hidden;
		box-sizing: content-box;
	}

	.wx-table-box.wx-active :global(.wx-row.wx-selected) {
		background-color: var(--wx-table-select-focus-background);
	}

	.wx-header-wrapper {
		position: sticky;
		z-index: 2;
		top: 0px;
	}

	.wx-body {
		position: relative;
	}

	.wx-data {
		position: relative;
	}

	.wx-scroll {
		position: relative;
		flex: 1;
		overflow: auto;
	}

	.wx-row {
		display: flex;
		box-sizing: border-box;
		background-color: var(--wx-background);
	}

	.wx-row:not(:last-child) {
		border-bottom: var(--wx-table-cell-border);
	}

	.wx-row.wx-autoheight :global(.wx-cell) {
		overflow: visible;
		text-overflow: initial;
		white-space: normal;
		word-break: break-all;
	}

	.wx-row.wx-autoheight {
		height: max-content;
	}

	.wx-selected {
		color: var(--wx-table-select-color);
		background-color: var(--wx-table-select-background);
	}

	.wx-selected :global(.wx-cell:first-child) {
		box-shadow: var(--wx-table-select-border);
	}

	.wx-cell.wx-collapsed {
		width: 36px;
		border-right: var(--wx-table-cell-border);
	}
</style>
