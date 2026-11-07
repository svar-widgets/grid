export type TResizeDelta = { dx: number; dy: number };

export interface IResizeConfig {
	target?: "column" | "row";
	down?: (node: HTMLElement) => void;
	move?: (delta: TResizeDelta) => void;
	up?: (delta: TResizeDelta) => void;
}

export function resize(node: HTMLElement, config?: IResizeConfig) {
	let x: number, dx: number, y: number, dy: number;

	function down(ev: MouseEvent) {
		x = ev.clientX;
		y = ev.clientY;

		node.style.opacity = "1";

		document.body.style.cursor =
			config?.target === "column" ? "ew-resize" : "ns-resize";
		document.body.style.userSelect = "none";

		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", up);

		config?.down?.(node);
	}

	function move(ev: MouseEvent) {
		dx = ev.clientX - x;
		dy = ev.clientY - y;

		config?.move?.({ dx, dy });
	}

	function up() {
		node.style.opacity = "";

		document.body.style.cursor = "";
		document.body.style.userSelect = "";

		config?.up?.({ dx, dy });

		window.removeEventListener("mousemove", move);
		window.removeEventListener("mouseup", up);
	}

	const stopClick = (ev: MouseEvent) => ev.stopPropagation();

	node.addEventListener("mousedown", down);
	node.addEventListener("click", stopClick);

	return {
		destroy() {
			node.removeEventListener("mousedown", down);
			node.removeEventListener("click", stopClick);
		},
	};
}
