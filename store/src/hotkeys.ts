export type hotkeysConfig = {
	[key: string]: ((event: KeyboardEvent) => void) | boolean;
};
export type HotkeyHandler = (params: {
	key: string;
	event: KeyboardEvent;
	isInput: boolean;
}) => void;

import { locate, hotkeys as libHotkeys } from "@svar-ui/lib-dom";

export const defaultHotkeys: hotkeysConfig = {
	tab: true,
	"shift+tab": true,
	arrowup: true,
	arrowdown: true,
	arrowright: true,
	arrowleft: true,
	enter: true,
	escape: true,
	f2: true,
	home: true,
	end: true,
	"ctrl+home": true,
	"ctrl+end": true,
	"ctrl+z": true,
	"ctrl+y": true,
};

export function hotkeys(
	node: HTMLElement,
	{ keys, exec }: { keys: hotkeysConfig | false; exec: HotkeyHandler }
) {
	if (!keys) return;
	function isTargetInput(event: KeyboardEvent) {
		const target = event.target as Element;

		return (
			target.tagName === "INPUT" ||
			target.tagName === "TEXTAREA" ||
			locate(target, "data-header-id")?.classList.contains("wx-filter") ||
			!!target.closest(".wx-cell.wx-editor")
		);
	}

	const config: { [key: string]: (event: KeyboardEvent) => void } = {};

	for (const key in keys) {
		const handler = keys[key];

		if (typeof handler !== "undefined") {
			if (typeof handler === "function") {
				config[key] = handler;
			} else if (handler) {
				config[key] = (event: KeyboardEvent) => {
					const isInput = isTargetInput(event);
					exec({ key, event, isInput });
				};
			}
		}
	}

	const unsubscribe = libHotkeys.subscribe(t => {
		t.configure(config, node);
	});

	return {
		destroy: () => {
			unsubscribe();
		},
	};
}
