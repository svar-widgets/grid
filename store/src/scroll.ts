import type { TScrollConfig } from "./types";

export function scrollTo(
	node: HTMLElement,
	config: { scroll: any; getHeight: any; getWidth: any; getScrollMargin: any }
) {
	let prev: TScrollConfig = null;
	config.scroll.subscribe((v: TScrollConfig) => {
		if (!v || v === prev) return;
		prev = v;

		const { left, top, height, width } = v;
		const bHeight = config.getHeight();
		const bWidth = config.getWidth();
		const margin = config.getScrollMargin();

		if (top >= 0) {
			const now = node.scrollTop;
			if (top < now) {
				node.scrollTop = top;
			} else if (top + height > now + bHeight) {
				node.scrollTop = top - bHeight + height;
			}
		}
		if (left >= 0) {
			const now = node.scrollLeft;
			if (left < now) {
				node.scrollLeft = left;
			} else if (left + width > now + bWidth - margin) {
				node.scrollLeft = left - bWidth + width + margin;
			}
		}
	});
}
