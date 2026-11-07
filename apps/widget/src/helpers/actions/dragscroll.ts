import { getPos } from "./reorder";
import type { IDragContext, IScrollState, TPointer } from "./reorder";

const SCROLL_SPEED_DELTA = 0.004;

export interface IDragScrollConfig {
	node: HTMLElement;
	left: number;
	top: number;
	bottom: number;
	sense: number;
	xScroll: boolean;
	yScroll: boolean;
}

type TDirection = { x: number; y: number };
type TBox = { width: number; height: number };

function initScrollState(): IScrollState {
	return {
		dirX: 0,
		dirY: 0,
		scrollSpeedFactor: 1,
	};
}

export function tryAutoScroll(
	ev: TPointer,
	box: TBox,
	context: IDragContext,
	dragScrollConfig: IDragScrollConfig
) {
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

export function startAutoScroll(
	context: IDragContext,
	config: IDragScrollConfig,
	dir: TDirection
) {
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

export function resetAutoScroll(context: IDragContext) {
	context.scrollSpeedFactor = 1;
	if (context.autoScrollTimer) {
		clearTimeout(context.autoScrollTimer);
		context.autoScrollTimer = undefined;
		clearInterval(context.activeAutoScroll);
		context.activeAutoScroll = undefined;
	}
}

function autoScroll(
	context: IDragContext,
	config: IDragScrollConfig,
	dir: TDirection
) {
	const { x, y } = dir;

	context.scrollSpeedFactor! += SCROLL_SPEED_DELTA;

	if (x !== 0) autoXScroll(context, config, x);
	if (y !== 0) autoYScroll(context, config, y);
}

function autoYScroll(
	context: IDragContext,
	config: IDragScrollConfig,
	dir: number
) {
	const scroll = config.node.scrollTop;

	autoScrollTo(
		scroll +
			Math.round(config.sense / 3) * context.scrollSpeedFactor! * dir,
		"scrollTop",
		config
	);
}

function autoXScroll(
	context: IDragContext,
	config: IDragScrollConfig,
	dir: number
) {
	const scroll = config.node.scrollLeft;

	autoScrollTo(
		scroll +
			Math.round(config.sense / 3) * context.scrollSpeedFactor! * dir,
		"scrollLeft",
		config
	);
}

function autoScrollTo(
	value: number,
	mode: "scrollTop" | "scrollLeft",
	config: IDragScrollConfig
) {
	config.node[mode] = value;
}
