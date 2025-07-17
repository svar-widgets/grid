export function getKeys(config) {
	return {
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
		"ctrl+z": config.undo,
		"ctrl+y": config.undo,
	};
}
