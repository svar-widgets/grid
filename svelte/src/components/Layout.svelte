<script>
	import { getContext, onMount } from "svelte";
	import { onresize } from "../helpers/actions/onresize";
	import { delegateClick, locateAttr, clickOutside } from "wx-lib-dom";
	import { hotkeys } from "wx-grid-store";
	import { scrollTo } from "wx-grid-store";

	import Cell from "./Cell.svelte";
	import HeaderFooter from "./HeaderFooter.svelte";
	import Overlay from "./Overlay.svelte";
	import Editor from "./inlineEditors/Editor.svelte";

	let {
		header,
		footer,
		overlay,
		select,
		multiselect,

		rowStyle,
		columnStyle,
		cellStyle,
		autoRowHeight,
	} = $props();

	const api = getContext("grid-store");

	const {
		dynamic,
		_columns,
		flatData: data,
		split,
		_sizes,
		selectedRows,
		editor,
		filter,
		scroll,
	} = api.getReactiveState();

	// will be calculated once, after rendering
	let SCROLLSIZE = $state(0);
	onMount(() => (SCROLLSIZE = getScrollSize()));

	let scrollLeft = $state(0),
		scrollTop = $state(0);
	const hasAny = $derived.by(() => {
		return $_columns.some(col => !col.hidden && col.flexgrow);
	});

	const defaultRowHeight = $derived($_sizes.rowHeight);
	let clientWidth = $state(0),
		clientHeight = $state(0);

	const fullHeight = $derived.by(() => {
		const count = $dynamic ? $dynamic.rowsCount : $data.length;
		const base = count * defaultRowHeight;
		if (autoRowHeight) {
			return (
				renderedHeight +
				renderRows.d +
				(count - renderEnd) * defaultRowHeight
			);
		} else {
			return base;
		}
	});
	// $inspect(fullHeight, "fullHeight");

	const fullWidth = $derived(
		$_columns.reduce((acc, col) => {
			if (!col.hidden) {
				acc += col.width;
			}
			return acc;
		}, 0)
	);
	// $inspect(fullWidth, "fullWidth");

	// mark split columns
	const leftColumns = $derived.by(() => {
		const columns = $_columns
			.slice(0, $split.left)
			.filter(c => !c.hidden)
			.map(a => ({ ...a }));
		let width = 0; // columns.reduce((acc, col) => acc + col.width, 0);
		columns.forEach(a => {
			a.fixed = 1;
			a.left = width;
			width += a.width;
		});
		if (columns.length) columns[columns.length - 1].fixed = -1;
		return { columns, width };
	});
	// $inspect(leftColumns, "leftColumns");

	const centerColumns = $derived.by(() => {
		const center = $_columns.slice($split.left).filter(c => !c.hidden);
		center.forEach(a => {
			a.fixed = 0;
		});
		return center;
	});

	const EXTRACOLUMNS = 1;
	const renderColumns = $derived.by(() => {
		let data, header, footer;

		// get visible columns
		const left = scrollLeft;
		const right = scrollLeft + clientWidth;

		let start = 0;
		let end = 0;
		let sum = 0;

		let d = 0;
		centerColumns.forEach((col, index) => {
			if (left > sum) {
				start = index;
				d = sum;
			}
			sum = sum + col.width;

			if (right > sum) end = index + EXTRACOLUMNS;
		});

		// include visible header/footer spans
		const headerPos = getHeaderPosition(start, d, "header");
		const footerPos = getHeaderPosition(start, d, "footer");

		const dh = headerPos.delta;
		const csH = headerPos.index;

		const df = footerPos.delta;
		const csF = footerPos.index;

		if (hasAny && fullWidth > clientWidth) {
			data = header = footer = [...leftColumns.columns, ...centerColumns];
		} else {
			data = [
				...leftColumns.columns,
				...centerColumns.slice(start, end + 1),
			];
			header = [
				...leftColumns.columns,
				...centerColumns.slice(csH, end + 1),
			];
			footer = [
				...leftColumns.columns,
				...centerColumns.slice(csF, end + 1),
			];
		}

		return { data, header, footer, d, df, dh };
	});
	// $inspect(renderColumns, "renderColumns");

	const contentWidth = $derived(
		hasAny && fullWidth <= clientWidth
			? clientWidth - (hasVScroll ? SCROLLSIZE : 0)
			: fullWidth
	);
	// $inspect(contentWidth, "contentWidth");

	const hasVScroll = $derived(
		clientWidth && clientHeight ? fullHeight > clientHeight : false
	);
	const hasHScroll = $derived(
		clientWidth && clientHeight ? fullWidth > clientWidth : false
	);

	// set global width
	// if we have flexible columns
	// then ignore the fullWidth as it doesn't include flex columns and has no meaning in this context
	const globalWidth = $derived(
		hasAny && fullWidth <= clientWidth
			? clientWidth
			: contentWidth < clientWidth
				? fullWidth + (hasVScroll ? SCROLLSIZE : 0)
				: -1
	);
	// $inspect(globalWidth, "globalWidth");

	// hom many rows visible
	const visibleRowsHeight = $derived(
		clientHeight -
			(header ? $_sizes.headerHeight : 0) -
			(footer ? $_sizes.footerHeight : 0) -
			(hasHScroll ? SCROLLSIZE : 0)
	);

	const visibleRows = $derived(
		Math.ceil(visibleRowsHeight / defaultRowHeight) + 1
	);

	// request data if necessary
	const EXTRAROWS = 2;
	const renderRows = $derived.by(() => {
		let start = 0,
			deltaTop = 0;
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

		return { d: deltaTop, start, end };
	});

	let lastCall = {};
	$effect(() => {
		if (
			$dynamic &&
			(lastCall.start !== renderRows.start ||
				lastCall.end !== renderRows.end)
		) {
			const { start, end } = renderRows;
			lastCall = { start, end };
			api.exec("request-data", { row: { start, end } });
		}
	});

	// get visible rows
	const dataRows = $derived.by(() => {
		if ($dynamic) return $data;
		else {
			let rows = $data;
			if ($filter) {
				rows = rows.filter($filter);
			}
			return rows.slice(renderRows.start, renderRows.end);
		}
	});
	let renderStart = $derived(renderRows.start);
	let renderEnd = $state();

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
			api.exec("open-editor", data);
		},
		click: (id, ev) => {
			if (select === false) return;

			const toggle = multiselect && ev.ctrlKey;
			const range = multiselect && ev.shiftKey;
			api.exec("select-row", { id, toggle, range });
		},
		"toggle-row": id => {
			const row = api.getRow(id);
			api.exec(row.open !== false ? "close-row" : "open-row", { id });
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

	const style = $derived(globalWidth ? `width:${globalWidth}px;` : "");

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

	let focusNode, editorWasActivated;
	const resetFocus = e => {
		if (e) editorWasActivated = true;
		if (!e && focusNode && editorWasActivated) {
			focusNode.focus();
			activeTable = true;
		} else activeTable = false;
	};
	$effect(() => resetFocus($editor));
	$effect(() => autoRowHeight && adjustHeight());

	let activeTable = $state(false);
</script>

<div
	class="wx-grid"
	style="--header-height:{header
		? $_sizes.headerHeight
		: 0}px; --footer-height:{footer
		? $_sizes.footerHeight
		: 0}px;--split-left-width:{leftColumns.width}px;"
>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={focusNode}
		class="wx-table-box"
		use:clickOutside={() => (activeTable = false)}
		class:wx-active={activeTable}
		onclick={() => (activeTable = true)}
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
			onscroll={onScroll}
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
						deltaLeft={renderColumns.dh}
						columns={renderColumns.header}
						{columnStyle}
					/>
				</div>
			{/if}
			<div
				class="wx-body"
				style="width:{contentWidth}px;height:{fullHeight}px;"
				onmousedown={ev => lockSelection(ev)}
				use:delegateClick={bodyClickHandlers}
			>
				{#if overlay}
					<Overlay {overlay} />
				{/if}
				<div
					bind:this={dataEl}
					class="wx-data"
					style="padding-top:{renderRows.d}px;padding-left:{renderColumns.d}px;"
				>
					{#each dataRows as row (row.id)}
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
							{#each renderColumns.data as col (col.id)}
								{#if col.collapsed}
									<div class="wx-cell wx-collapsed"></div>
								{:else if $editor?.id === row.id && $editor.column == col.id}
									<Editor {col} />
								{:else if col.cell}
									<col.cell
										{api}
										{row}
										{col}
										{columnStyle}
										{cellStyle}
										onaction={({ action, data }) =>
											api.exec(action, data)}
									/>
								{:else}
									<Cell
										{row}
										{col}
										{columnStyle}
										{cellStyle}
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
					deltaLeft={renderColumns.df}
					columns={renderColumns.footer}
					{columnStyle}
				/>
			{/if}
		</div>
	</div>
</div>

<style>
	.wx-grid {
		height: 100%;
		/* width: 100%;
	}
	.wx-grid :global(*) {
		scroll-margin-top: var(--header-height);
		scroll-margin-bottom: var(--footer-height);
		scroll-margin-left: var(--split-left-width); */
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
