export function onresize(node, handler) {
	const ro = new ResizeObserver(data => handler(data[0].contentRect));
	ro.observe(node.parentNode);

	return {
		destroy() {
			ro.disconnect();
		},
	};
}
