import { locate, id } from "@svar-ui/lib-dom";

const SHIFT = 5;
const LONG_TOUCH_DELAY = 700;

function getID(node) {
	return id(node.getAttribute("data-id"));
}

export function getOffset(node) {
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

export function getPos(ev, node) {
	const offset = getOffset(node);
	return { x: ev.clientX - offset.x, y: ev.clientY - offset.y };
}

export function reorder(node, config) {
	let context = null;
	let touchTimer, startPos;
	let started = false,
		touched = false;
	const container = document.createElement("DIV");
	container.className = "wx-drag-zone";
	container.setAttribute("tabindex", -1);

	function resetTimer() {
		clearTimeout(touchTimer);
		touchTimer = null;
	}

	function down(ev) {
		const source = locate(ev);
		if (!source) return;

		context = {
			container,
			sourceNode: ev.target,
			from: getID(source),
			pos: getPos(ev, node),
		};
		startPos = context.pos;
		move(ev);
	}

	function move(ev) {
		if (!context) return;
		const p = (context.pos = getPos(ev, node));

		if (!started) {
			if (
				!touched &&
				!ev?.target?.getAttribute("draggable-data") &&
				Math.abs(startPos.x - p.x) < SHIFT &&
				Math.abs(startPos.y - p.y) < SHIFT
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
		} else context.targetNode = ev.target;

		if (config?.move) config.move(ev, context);

		container.style.left = -(context.offset ? context.offset.x : 0) + "px";
		container.style.top =
			context.pos.y + (context.offset ? context.offset.y : 0) + "px";
	}

	function up(ev) {
		if (container.parentNode) container.parentNode.removeChild(container);
		container.innerHTML = "";

		if (started && config?.end) config.end(ev, context);
		context = startPos = null;

		end();
	}

	function handleMouseDown(ev) {
		if (!config?.getReorder()) return;
		if (ev.button !== 0) return;

		// native dragscroll prevention
		preventUserSelect(ev);

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);

		down(ev);
	}

	function handleMouseMove(ev) {
		move(ev);
	}

	function handleMouseUp(ev) {
		up(ev);
	}

	function handleTouchStart(ev) {
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

			ev.target.removeEventListener("touchmove", handleTouchMove);
			ev.target.removeEventListener("touchend", handleTouchEnd);

			up(ev);
		}

		ev.target.addEventListener("touchmove", handleTouchMove);
		ev.target.addEventListener("touchend", handleTouchEnd);
		node.addEventListener("contextmenu", handleContext);
	}

	function handleTouchMove(ev) {
		if (started) {
			ev.preventDefault();
			move(ev.touches[0]);
		} else if (touchTimer) resetTimer();
	}

	function handleContext(ev) {
		if (started || touchTimer) {
			ev.preventDefault();
			return false;
		}
	}

	function preventDefault(ev) {
		ev.preventDefault();
	}

	function preventUserSelect(ev) {
		const { hasDraggable } = config.getDraggableInfo();

		if (!hasDraggable || ev.target.getAttribute("draggable-data")) {
			document.body.style.userSelect = "none";
			document.body.style.webkitUserSelect = "none";
		}
	}

	function start(ev) {
		started = true;

		if (config?.start) {
			if (config.start(ev, context) === false) return false;
			else {
				node.appendChild(container);
				document.body.style.cursor = "move";
			}
		}
	}

	function end(full) {
		started = touched = false;
		document.body.style.cursor = "";
		document.body.style.userSelect = "";
		document.body.style.webkitUserSelect = "";

		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", handleMouseUp);

		if (full) {
			node.removeEventListener("mousedown", handleMouseDown);
			node.removeEventListener("touchstart", handleTouchStart);
			node.removeEventListener("dragstart", preventDefault);
		}
	}

	node.addEventListener("mousedown", handleMouseDown);
	node.addEventListener("touchstart", handleTouchStart);
	node.addEventListener("dragstart", preventDefault);

	return {
		destroy() {
			end(true);
		},
	};
}
