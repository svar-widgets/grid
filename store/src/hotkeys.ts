export type hotkeysConfig = { [key: string]: HotkeyHandler | boolean };
export type HotkeyHandler = (params: {
	key: string;
	event: KeyboardEvent;
	node: HTMLElement;
	isInput: boolean;
}) => void;

export function hotkeys(
	node: HTMLElement,
	{ keys, exec }: { keys: hotkeysConfig; exec: HotkeyHandler }
) {
	for (const key in keys) {
		const fixed = key.toLowerCase().replace(/ /g, "");
		if (fixed !== key) {
			keys[fixed] = keys[key];
		}
	}
	function handleKeydown(event: any) {
		let code = event.code.toLowerCase();
		if (code === " ") code = "space";
		const key = `${event.ctrlKey || event.metaKey ? "ctrl+" : ""}${
			event.shiftKey ? "shift+" : ""
		}${event.altKey ? "alt+" : ""}${code}`;
		const handler = keys[key];

		if (typeof handler !== "undefined") {
			const isInput =
				event.target.tagName === "INPUT" ||
				event.target.tagName === "TEXTAREA";

			if (typeof handler === "function") {
				handler({ key, event, node, isInput });
			} else if (handler) {
				exec({ key, event, node, isInput });
			}
		}
	}

	node.addEventListener("keydown", handleKeydown);
	return {
		destroy: () => {
			node.removeEventListener("keydown", handleKeydown);
		},
	};
}