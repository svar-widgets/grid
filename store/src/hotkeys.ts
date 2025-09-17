export type hotkeysConfig = { [key: string]: HotkeyHandler | boolean };
export type HotkeyHandler = (params: {
	key: string;
	event: KeyboardEvent;
	node: HTMLElement;
	isInput: boolean;
}) => void;

import { locate } from "@svar-ui/lib-dom";

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
		let code = event.code.replace("Key", "").toLowerCase();
		if (code === " ") code = "space";
		const key = `${event.ctrlKey || event.metaKey ? "ctrl+" : ""}${
			event.shiftKey ? "shift+" : ""
		}${event.altKey ? "alt+" : ""}${code.replace(/^key/, "")}`;
		const handler = keys[key];

		if (typeof handler !== "undefined") {
			const isInput =
				event.target.tagName === "INPUT" ||
				event.target.tagName === "TEXTAREA" ||
				locate(event.target, "data-header-id")?.classList.contains(
					"wx-filter"
				) ||
				!!event.target.closest(".wx-cell.wx-editor");
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
