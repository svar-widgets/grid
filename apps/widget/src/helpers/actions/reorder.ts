import { locate, getID } from "@svar-ui/lib-dom";
import type { TID } from "@svar-ui/lib-state";

const SHIFT = 5;
const LONG_TOUCH_DELAY = 700;

// a mouse event, or a single touch point of a touch event
export type TPointer = MouseEvent | Touch;

export interface IScrollState {
	dirX: number;
	dirY: number;
	scrollSpeedFactor: number;
}

// shared by the reorder action, the grid's drag handlers and the auto-scroll
export interface IDragContext {
	container: HTMLElement;
	sourceNode: HTMLElement;
	from: TID;
	to?: TID;
	pos: { x: number; y: number };
	offset?: { x: number; y: number };
	targetNode?: Element | null;
	scrollState?: IScrollState;
	scrollSpeedFactor?: number;
	autoScrollTimer?: ReturnType<typeof setTimeout>;
	activeAutoScroll?: ReturnType<typeof setInterval>;
}

export interface IReorderConfig {
	start?: (ev: TPointer, context: IDragContext) => boolean | void;
	move?: (ev: TPointer, context: IDragContext) => void;
	end?: (ev: Event, context: IDragContext) => void;
	getReorder: () => boolean | undefined;
	getDraggableInfo: () => { hasDraggable: boolean };
}

export function getOffset(node: HTMLElement) {
	const box = node.getBoundingClientRect();
	const body = document.body;
	const top = box.top + body.scrollTop - body.clientTop || 0;
	const left = box.left + body.scrollLeft - body.clientLeft || 0;
	return {
		y: Math.round(top),
		x: Math.round(left),
		width: node.offsetWidth,
		height: node.offsetHeight,
	};
}

export function getPos(ev: TPointer, node: HTMLElement) {
	const offset = getOffset(node);
	return { x: ev.clientX - offset.x, y: ev.clientY - offset.y };
}

export function reorder(node: HTMLElement, config: IReorderConfig) {
	let context: IDragContext | null = null;
	let touchTimer: ReturnType<typeof setTimeout> | null = null,
		startPos: { x: number; y: number } | null = null;
	let started = false,
		touched = false;
	const container = document.createElement("DIV");
	container.className = "wx-drag-zone";
	container.setAttribute("tabindex", "-1");

	function resetTimer() {
		clearTimeout(touchTimer!);
		touchTimer = null;
	}

	function down(ev: TPointer) {
		const source = locate(ev as unknown as Event);
		const target = ev.target as HTMLElement;
		const resizer = target.classList.contains("wx-grip");
		if (!source || resizer) return;

		context = {
			container,
			sourceNode: target,
			from: getID(source),
			pos: getPos(ev, node),
		};
		startPos = context.pos;
		move(ev);
	}

	function move(ev: TPointer) {
		if (!context) return;
		const p = (context.pos = getPos(ev, node));

		if (!started) {
			if (
				!touched &&
				!(ev?.target as HTMLElement | null)?.getAttribute(
					"draggable-data"
				) &&
				Math.abs(startPos!.x - p.x) < SHIFT &&
				Math.abs(startPos!.y - p.y) < SHIFT
			)
				return;
			else {
				if (start(ev) === false) return end();
			}
		}

		if (touched) {
			const scrollLeft =
				window.scrollX ||
				document.documentElement.scrollLeft ||
				document.body.scrollLeft;
			const scrollTop =
				window.scrollY ||
				document.documentElement.scrollTop ||
				document.body.scrollTop;

			context.targetNode = document.elementFromPoint(
				ev.pageX - scrollLeft,
				ev.pageY - scrollTop
			);
		} else context.targetNode = ev.target as Element;

		if (config?.move) config.move(ev, context);

		container.style.left = -(context.offset ? context.offset.x : 0) + "px";
		container.style.top =
			context.pos.y + (context.offset ? context.offset.y : 0) + "px";
	}

	function up(ev: Event) {
		container.parentNode?.removeChild(container);
		container.innerHTML = "";

		if (started && config?.end) config.end(ev, context!);
		context = startPos = null;

		end();
	}

	function handleDragStart(ev: DragEvent) {
		if (config?.getReorder()) return preventDefault(ev);
	}

	function handleMouseDown(ev: MouseEvent) {
		if (!config?.getReorder()) return;
		if (ev.button !== 0) return;

		// native dragscroll prevention
		preventUserSelect(ev);

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);

		down(ev);
	}

	function handleMouseMove(ev: MouseEvent) {
		move(ev);
	}

	function handleMouseUp(ev: MouseEvent) {
		up(ev);
	}

	function handleTouchStart(ev: TouchEvent) {
		if (!config?.getReorder()) return;

		touchTimer = setTimeout(() => {
			touched = true;
			down(ev.touches[0]);
		}, LONG_TOUCH_DELAY);

		// prevent user selection on touch (pre-drag)
		preventUserSelect(ev);

		function handleTouchEnd() {
			if (touchTimer) resetTimer();

			// removed elements will still have touch events pointed at them, and these events won't necessarily bubble up
			// this creates an issue where the touchmove/touchend events are no longer called if we attach them directly to the parent node, and the event target is removed from DOM
			// best practice suggests attaching event handlers directly to the touch event target
			// in this case, touch events will continue to fire normally
			// https://developer.mozilla.org/en-US/docs/Web/API/Touch/target

			ev.target!.removeEventListener(
				"touchmove",
				handleTouchMove as EventListener
			);
			ev.target!.removeEventListener("touchend", handleTouchEnd);

			up(ev);
		}

		ev.target!.addEventListener(
			"touchmove",
			handleTouchMove as EventListener
		);
		ev.target!.addEventListener("touchend", handleTouchEnd);
		node.addEventListener("contextmenu", handleContext);
	}

	function handleTouchMove(ev: TouchEvent) {
		if (started) {
			ev.preventDefault();
			move(ev.touches[0]);
		} else if (touchTimer) resetTimer();
	}

	function handleContext(ev: Event) {
		if (started || touchTimer) {
			ev.preventDefault();
			return false;
		}
	}

	function preventDefault(ev: Event) {
		ev.preventDefault();
	}

	function preventUserSelect(ev: Event) {
		const { hasDraggable } = config.getDraggableInfo();

		if (
			!hasDraggable ||
			(ev.target as HTMLElement).getAttribute("draggable-data")
		) {
			document.body.style.userSelect = "none";
			document.body.style.webkitUserSelect = "none";
		}
	}

	function start(ev: TPointer) {
		started = true;

		if (config?.start) {
			if (config.start(ev, context!) === false) return false;
			else {
				node.appendChild(container);
				document.body.style.cursor = "move";
			}
		}
	}

	function end(full?: boolean) {
		started = touched = false;
		document.body.style.cursor = "";
		document.body.style.userSelect = "";
		document.body.style.webkitUserSelect = "";

		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", handleMouseUp);

		if (full) {
			node.removeEventListener("mousedown", handleMouseDown);
			node.removeEventListener("touchstart", handleTouchStart);
			node.removeEventListener("dragstart", handleDragStart);
		}
	}

	node.addEventListener("mousedown", handleMouseDown);
	node.addEventListener("touchstart", handleTouchStart);
	node.addEventListener("dragstart", handleDragStart);

	return {
		destroy() {
			end(true);
		},
	};
}
