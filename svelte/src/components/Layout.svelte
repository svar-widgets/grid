<script>
	import { getContext, tick, onMount } from "svelte";
	import { onresize } from "../helpers/actions/onresize";
	import { reorder as drag, getOffset } from "../helpers/actions/reorder";
	import {
		resetAutoScroll,
		tryAutoScroll,
	} from "../helpers/actions/dragscroll";
	import {
		clickOutside,
		delegateClick,
		locateAttr,
		locate,
		id,
	} from "@svar-ui/lib-dom";

	import { hotkeys } from "@svar-ui/grid-store";
	import { getKeys } from "../helpers/hotkeys";
	import { scrollTo } from "@svar-ui/grid-store";

	import Cell from "./Cell.svelte";
	import HeaderFooter from "./HeaderFooter.svelte";
	import Overlay from "./Overlay.svelte";
	import Editor from "./inlineEditors/Editor.svelte";
	import Print from "./print/Print.svelte";

	let {
		header,
		footer,
		overlay,
		multiselect,
		reorder,
		onreorder,
		rowStyle,
		columnStyle,
		cellStyle,
		autoRowHeight,
		resize,
		clientWidth,
		clientHeight,
		responsiveLevel,
	} = $props();

	const api = getContext("grid-store");

	const {
		dynamic,
		_columns,
		flatData: data,
		split,
		_sizes,
		selectedRows,
		select,
		editor,
		scroll,
		tree,
		focusCell,
		_print,
		undo,
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
	let tableNode;

	// reorder
	let dragItem = $state(null),
		dragNode = $state(null);

	const fullHeight = $derived.by(() => {
		const count = $dynamic ? $dynamic.rowCount : $data.length;
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

	// mark split left columns
	const leftColumns = $derived.by(() => {
		let columns = [];
		let width = 0;

		if ($split.left) {
			columns = $_columns
				.slice(0, $split.left)
				.filter(c => !c.hidden)
				.map(a => ({ ...a }));
			columns.forEach(a => {
				a.fixed = { left: 1 };
				a.left = width;
				width += a.width;
			});
			if (columns.length)
				columns[columns.length - 1].fixed = { left: -1 };
		}

		return { columns, width };
	});

	// mark split right columns
	const rightColumns = $derived.by(() => {
		let columns = [];
		let width = 0;

		if ($split.right) {
			columns = $_columns
				.slice($split.right * -1)
				.filter(c => !c.hidden)
				.map(a => ({ ...a }));
			for (let i = columns.length - 1; i >= 0; i--) {
				const col = columns[i];
				col.fixed = { right: 1 };
				col.right = width;
				width += col.width;
			}
			if (columns.length) columns[0].fixed = { right: -1 };
		}

		return { columns, width };
	});
	// $inspect(leftColumns, "leftColumns");

	const centerColumns = $derived.by(() => {
		const center = $_columns
			.slice($split.left, $_columns.length - ($split.right ?? 0))
			.filter(c => !c.hidden);
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

		// header and footer cells correction depending on colSpans
		const rightSpanDelta = { header: 0, footer: 0 };
		for (let i = end; i >= start; i--) {
			["header", "footer"].forEach(key => {
				if (centerColumns[i])
					centerColumns[i][key].forEach(hCell => {
						const colspan = hCell.colspan;
						if (colspan && colspan > 1) {
							const diff = colspan - (end - i + 1);
							if (diff > 0) {
								rightSpanDelta[key] = Math.max(
									rightSpanDelta[key],
									diff
								);
							}
						}
					});
			});
		}

		// include visible header/footer spans
		const headerPos = getHeaderPosition(start, d, "header");
		const footerPos = getHeaderPosition(start, d, "footer");

		const dh = headerPos.delta;
		const csH = headerPos.index;

		const df = footerPos.delta;
		const csF = footerPos.index;

		if (hasAny && fullWidth > clientWidth) {
			data =
				header =
				footer =
					[
						...leftColumns.columns,
						...centerColumns,
						...rightColumns.columns,
					];
		} else {
			data = [
				...leftColumns.columns,
				...centerColumns.slice(start, end + 1),
				...rightColumns.columns,
			];
			header = [
				...leftColumns.columns,
				...centerColumns.slice(csH, end + rightSpanDelta.header + 1),
				...rightColumns.columns,
			];
			footer = [
				...leftColumns.columns,
				...centerColumns.slice(csF, end + rightSpanDelta.footer + 1),
				...rightColumns.columns,
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

	const headerHeight = $derived(header ? $_sizes.headerHeight : 0);
	const footerHeight = $derived(footer ? $_sizes.footerHeight : 0);

	const hasVScroll = $derived(
		clientWidth && clientHeight
			? fullHeight + headerHeight + footerHeight >=
					clientHeight - (fullWidth >= clientWidth ? SCROLLSIZE : 0)
			: false
	);
	const hasHScroll = $derived(
		clientWidth && clientHeight ? fullWidth >= clientWidth : false
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
			headerHeight -
			footerHeight -
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
			$dynamic ? $dynamic.rowCount : $data.length,
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

	const dataRows = $derived.by(() => {
		if ($dynamic) return $data;
		else {
			return $data.slice(renderRows.start, renderRows.end);
		}
	});

	//get visible selection
	const visibleSelection = $derived(
		$selectedRows.filter(s => dataRows.some(r => r.id === s))
	);

	let renderStart = $derived(renderRows.start);
	let renderEnd = $state();

	function onScroll(ev) {
		scrollTop = ev.target.scrollTop;
		scrollLeft = ev.target.scrollLeft;
	}

	function lockSelection(ev) {
		// we prevent default on mousedown reaction to stop the unwanted text selection
		// in the same time we need to have focus-in, so trigger it manually
		//
		// in future, it will be optimal to block text selection directly, without affecting focus related event
		if (ev.shiftKey) ev.preventDefault();
		tableNode.focus();
	}

	function checkDraggable() {
		return !!$_columns.find(c => !!c.draggable);
	}

	let postDrag;
	let movementY;

	const bodyClickHandlers = {
		dblclick: (id, ev) => {
			const data = { id, column: locateAttr(ev, "data-col-id") };
			api.exec("open-editor", data);
		},
		click: (id, ev) => {
			if (postDrag) return;
			const column = locateAttr(ev, "data-col-id");
			api.exec("focus-cell", { row: id, column, eventSource: "click" });

			if (select === false) return;

			const toggle = multiselect && ev.ctrlKey;
			const range = multiselect && ev.shiftKey;
			if ($select) api.exec("select-row", { id, toggle, range });
		},
		"toggle-row": id => {
			const row = api.getRow(id);
			api.exec(row.open !== false ? "close-row" : "open-row", { id });
		},
		"ignore-click": () => {
			return false;
		},
	};

	const dragScrollConfig = $derived({
		top: headerHeight,
		bottom: footerHeight,
		left: leftColumns.width,
		xScroll: hasHScroll,
		yScroll: hasVScroll,
		sense:
			autoRowHeight && dragNode
				? dragNode.offsetHeight
				: Math.max($_sizes.rowHeight, 40),
		node: tableNode && tableNode.firstElementChild,
	});

	function startDrag(ev, context) {
		const { container, sourceNode, from } = context;
		const hasDraggable = checkDraggable();

		if (hasDraggable && !sourceNode.getAttribute("draggable-data"))
			return false;

		dragItem = from;

		if (api.getRow(dragItem).open)
			api.exec("close-row", { id: dragItem, nested: true });

		// default to drag source (target may be shifted by this moment)
		const itemNode = locate(sourceNode, "data-id");
		dragNode = itemNode.cloneNode(true);
		dragNode.classList.remove("wx-selected");
		dragNode
			.querySelectorAll("[tabindex]")
			.forEach(element => element.setAttribute("tabindex", "-1"));
		container.appendChild(dragNode);

		const offsetX = scrollLeft - renderColumns.d;
		const vScrollSize = hasVScroll ? SCROLLSIZE : 0;

		container.style.width =
			Math.min(
				clientWidth - vScrollSize,
				hasAny && fullWidth <= clientWidth
					? contentWidth
					: contentWidth - vScrollSize
			) +
			offsetX +
			"px";

		const itemPos = getOffset(itemNode);
		context.offset = {
			x: offsetX,
			y: -Math.round(itemPos.height / 2),
		};

		if (!movementY) movementY = ev.clientY;
	}

	function moveDrag(ev, context) {
		const { from } = context;
		const pos = context.pos;
		const box = getOffset(tableNode);

		pos.x = box.x;

		const min = dragScrollConfig.top;
		if (pos.y < min) pos.y = min;
		else {
			const max =
				box.height -
				(hasHScroll && SCROLLSIZE > 0
					? SCROLLSIZE
					: Math.round(dragScrollConfig.sense / 2)) -
				dragScrollConfig.bottom;
			if (pos.y > max) pos.y = max;
		}

		if (tableNode.contains(context.targetNode)) {
			const targetRow = locate(context.targetNode, "data-id");
			const to = id(targetRow?.getAttribute("data-id"));

			if (to && to !== from) {
				context.to = to;

				const rowHeight = autoRowHeight
					? dragNode?.offsetHeight
					: $_sizes.rowHeight;

				if (scrollTop === 0 || pos.y > min + rowHeight - 1) {
					const targetRect = targetRow.getBoundingClientRect();
					const dragNodeOffset = getOffset(dragNode);

					const dragNodePos = dragNodeOffset.y;
					const targetNodePos = targetRect.y;

					const dir = dragNodePos > targetNodePos ? -1 : 1;
					const initialMode = dir === 1 ? "after" : "before";
					const diff = Math.abs(
						api.getRowIndex(from) - api.getRowIndex(to)
					);

					const mode =
						diff !== 1
							? initialMode === "before"
								? "after"
								: "before"
							: initialMode;

					if (diff === 1) {
						// prevent moving items near borders
						if (dir === -1 && ev.clientY > movementY) return;
						if (dir === 1 && ev.clientY < movementY) return;
					}

					movementY = ev.clientY;

					api.exec("move-item", {
						id: from,
						target: to,
						mode,
						inProgress: true,
					});
				}
			}

			onreorder && onreorder({ event: ev, context });
		}

		tryAutoScroll(ev, box, context, dragScrollConfig);
	}

	function endDrag(ev, context) {
		const { from, to } = context;

		api.exec("move-item", {
			id: from,
			target: to,
			inProgress: false,
		});

		// block potential clicks after mouseup
		postDrag = setTimeout(() => {
			postDrag = 0;
		}, 1);

		dragItem = dragNode = movementY = null;
		resetAutoScroll(context);
	}

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

	const style = $derived(globalWidth > 0 ? `width:${globalWidth}px;` : "");

	let dataEl;
	let rowHeights = [];
	let renderedHeight = $state(0);
	function adjustHeight() {
		// make sure the UI is updated before syncing the state
		tick().then(() => {
			let rh = 0;
			let re = renderStart;
			Array.from(dataEl.children).forEach((row, i) => {
				rowHeights[renderStart + i] = row.offsetHeight;
				rh += row.offsetHeight;
				re++;
			});

			renderedHeight = rh;
			renderEnd = re;
		});
	}

	$effect(() => dataRows && autoRowHeight && adjustHeight());

	/* focus is a focusable cell which either belongs to visible selection 
	   or is the first visible cell in grid, which maybe scrolled up due to EXTRAROWS 
	   If select is false, focusCell can be outside selection*/
	let focus = $state();

	$effect(() => {
		if (
			$focusCell &&
			(!$select ||
				!visibleSelection.length ||
				visibleSelection.includes($focusCell.row))
		)
			focus = { ...$focusCell };
		else if (dataRows.length && renderColumns.data.length) {
			if (
				!focus ||
				(visibleSelection.length &&
					!visibleSelection.includes(focus.row)) ||
				dataRows.findIndex(r => r.id == focus.row) === -1 ||
				renderColumns.data.findIndex(
					c => c.id == focus.column && !c.collapsed
				) === -1
			) {
				const row = visibleSelection[0] || dataRows[0].id;
				const cind = renderColumns.data.findIndex(c => !c.collapsed);
				if (cind !== -1)
					focus = { row, column: renderColumns.data[cind].id };
				else focus = null;
			}
		} else focus = null;
	});
</script>

<div
	class={`wx-grid ${responsiveLevel ? `wx-responsive-${responsiveLevel}` : ""}`}
	style="--header-height:{headerHeight}px; --footer-height:{footerHeight}px;--split-left-width:{leftColumns.width}px;
		--split-right-width:{rightColumns.width}px;"
>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		bind:this={tableNode}
		class="wx-table-box"
		use:onresize={resize}
		use:drag={{
			start: startDrag,
			move: moveDrag,
			end: endDrag,
			getReorder: () => reorder,
			getDraggableInfo: () => ({ hasDraggable: checkDraggable() }),
		}}
		use:hotkeys={{
			keys: getKeys({ undo: $undo }),
			exec: v => api.exec("hotkey", v),
		}}
		{style}
		role={$tree ? "treegrid" : "grid"}
		aria-colcount={renderColumns.data.length}
		aria-rowcount={dataRows.length}
		aria-multiselectable={$tree && multiselect ? true : undefined}
	>
		<div
			class="wx-scroll"
			style="overflow-x:{hasHScroll
				? 'scroll'
				: 'hidden'};overflow-y:{hasVScroll ? 'scroll' : 'hidden'};"
			onscroll={onScroll}
			use:scrollTo={{
				scroll,
				getWidth: () => clientWidth - (hasVScroll ? SCROLLSIZE : 0),
				getHeight: () => visibleRowsHeight,
				getScrollMargin: () => leftColumns.width + rightColumns.width,
			}}
		>
			{#if header}
				<div class="wx-header-wrapper">
					<HeaderFooter
						{contentWidth}
						deltaLeft={renderColumns.dh}
						columns={renderColumns.header}
						{columnStyle}
						bodyHeight={visibleRowsHeight - +footer}
					/>
				</div>
			{/if}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="wx-body"
				style="width:{contentWidth}px;height:{fullHeight}px;"
				onmousedown={ev => lockSelection(ev)}
				use:clickOutside={() =>
					api.exec("focus-cell", { eventSource: "click" })}
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
					{#each dataRows as row, rIndex (row.id)}
						<div
							class:wx-autoheight={autoRowHeight}
							class={"wx-row" +
								(rowStyle ? " " + rowStyle(row) : "")}
							data-id={row.id}
							data-context-id={row.id}
							class:wx-selected={$selectedRows.indexOf(row.id) !==
								-1}
							class:wx-inactive={dragItem === row.id}
							style={`${autoRowHeight ? "min-height" : "height"}:${defaultRowHeight}px;`}
							role="row"
							aria-rowindex={rIndex}
							aria-expanded={row.open}
							aria-level={$tree ? row.$level + 1 : undefined}
							aria-selected={$tree
								? $selectedRows.indexOf(row.id) !== -1
								: undefined}
							tabindex="-1"
						>
							{#each renderColumns.data as column (column.id)}
								{#if column.collapsed}
									<div class="wx-cell wx-collapsed"></div>
								{:else if $editor?.id === row.id && $editor.column == column.id}
									<Editor {row} {column} />
								{:else}
									<Cell
										{row}
										{column}
										{columnStyle}
										{cellStyle}
										{reorder}
										focusable={focus?.row === row.id &&
											focus?.column == column.id}
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
{#if $_print}
	<Print
		config={$_print}
		{rowStyle}
		{columnStyle}
		{cellStyle}
		{header}
		{footer}
		{reorder}
	/>
{/if}

<style>
	.wx-grid {
		height: 100%;
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

	.wx-header-wrapper {
		position: sticky;
		z-index: 3;
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
		scroll-padding-top: var(--header-height);
		scroll-padding-bottom: var(--footer-height);
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

	.wx-inactive {
		color: var(--wx-table-drag-over-background);
		background-color: var(--wx-table-drag-over-background);
		--wx-table-select-border: none;
	}

	:global(.wx-drag-zone) {
		z-index: 10;
		position: absolute;
		pointer-events: none;
		overflow: hidden;
		box-shadow: var(--wx-table-drag-zone-shadow);
	}

	.wx-cell.wx-collapsed {
		width: 36px;
		border-right: var(--wx-table-cell-border);
	}
</style>
