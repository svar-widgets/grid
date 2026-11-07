export function onresize(
	node: HTMLElement,
	handler: (rect: DOMRectReadOnly) => void
) {
	const ro = new ResizeObserver(data => {
		requestAnimationFrame(() => handler(data[0].contentRect));
	});

	ro.observe(node.parentNode as Element);

	return {
		destroy() {
			ro.disconnect();
		},
	};
}
