export function stripBlocks(options = {}) {
	const {
		strip = true,
		startMarker = "//<pro>",
		endMarker = "//</pro>",
	} = options;

	const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const blockRe = new RegExp(
		`^[ \\t]*${esc(startMarker)}[ \\t]*\\r?\\n[\\s\\S]*?^[ \\t]*${esc(endMarker)}[ \\t]*\\r?\\n?`,
		"gm"
	);

	return {
		name: "strip-blocks",
		enforce: "pre",
		transform: {
			filter: {
				code: startMarker,
			},
			handler(code, _id) {
				if (!strip) return null;
				const transformed = code.replace(blockRe, "");
				if (transformed === code) return null;
				return { code: transformed, map: null };
			},
		},
	};
}
