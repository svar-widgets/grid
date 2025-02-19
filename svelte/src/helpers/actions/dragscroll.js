import { getPos } from "./reorder";

const SCROLL_SPEED_DELTA = 0.004;

function initScrollState() {
	return {
		dirX: 0,
		dirY: 0,
		scrollSpeedFactor: 1,
	};
}

export function tryAutoScroll(ev, box, context, dragScrollConfig) {
	const { node, left, top, bottom, sense, xScroll, yScroll } =
		dragScrollConfig;
	const rPos = getPos(ev, node);

	if (!context.scrollState) context.scrollState = initScrollState();

	let newDirX = 0;
	let newDirY = 0;

	if (rPos.x < left + sense) {
		newDirX = -1;
	} else if (rPos.x > box.width - sense) {
		newDirX = 1;
	}

	if (rPos.y < top + Math.round(sense / 2)) {
		newDirY = -1;
	} else if (rPos.y > box.height - bottom - Math.round(sense / 2)) {
		newDirY = 1;
	}

	if (
		context.scrollState.dirX !== newDirX ||
		context.scrollState.dirY !== newDirY
	) {
		resetAutoScroll(context);
		context.scrollState.dirX = newDirX;
		context.scrollState.dirY = newDirY;
	}

	if (
		(xScroll && context.scrollState.dirX !== 0) ||
		(yScroll && context.scrollState.dirY !== 0)
	) {
		startAutoScroll(context, dragScrollConfig, {
			x: context.scrollState.dirX,
			y: context.scrollState.dirY,
		});
	}
}

export function startAutoScroll(context, config, dir) {
	if (context.autoScrollTimer) return;

	context.autoScrollTimer = setTimeout(() => {
		context.activeAutoScroll = setInterval(
			autoScroll,
			15,
			context,
			config,
			dir
		);
	}, 250);
}

export function resetAutoScroll(context) {
	context.scrollSpeedFactor = 1;
	if (context.autoScrollTimer) {
		context.autoScrollTimer = clearTimeout(context.autoScrollTimer);
		context.activeAutoScroll = clearInterval(context.activeAutoScroll);
	}
}

function autoScroll(context, config, dir) {
	const { x, y } = dir;

	context.scrollSpeedFactor += SCROLL_SPEED_DELTA;

	if (x !== 0) autoXScroll(context, config, x);
	if (y !== 0) autoYScroll(context, config, y);
}

function autoYScroll(context, config, dir) {
	const scroll = config.node.scrollTop;

	autoScrollTo(
		scroll + Math.round(config.sense / 3) * context.scrollSpeedFactor * dir,
		"scrollTop",
		config
	);
}

function autoXScroll(context, config, dir) {
	const scroll = config.node.scrollLeft;

	autoScrollTo(
		scroll + Math.round(config.sense / 3) * context.scrollSpeedFactor * dir,
		"scrollLeft",
		config
	);
}

function autoScrollTo(value, mode, config) {
	config.node[mode] = value;
}
