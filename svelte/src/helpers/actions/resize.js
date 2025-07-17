export function resize(node, config) {
	let x, dx;

	function down(ev) {
		x = ev.clientX;

		node.style.opacity = 1;

		document.body.style.cursor = "ew-resize";
		document.body.style.userSelect = "none";

		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", up);

		if (config && config.down) config.down(node);
	}

	function move(ev) {
		dx = ev.clientX - x;

		if (config && config.move) config.move(dx);
	}

	function up() {
		node.style.opacity = "";

		document.body.style.cursor = "";
		document.body.style.userSelect = "";

		if (config && config.up) config.up(dx);

		window.removeEventListener("mousemove", move);
		window.removeEventListener("mouseup", up);
	}

	node.addEventListener("mousedown", down);

	return {
		destroy() {
			node.removeEventListener("mousedown", down);
		},
	};
}
