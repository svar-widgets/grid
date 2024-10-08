module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	extends: ["plugin:cypress/recommended", "eslint:recommended", "prettier"],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
		extraFileExtensions: [".svelte"],
	},
	plugins: ["svelte3"],

	overrides: [
		{
			files: ["*.svelte"],
			processor: "svelte3/svelte3",
		},
	],
	settings: {
		"svelte3/ignore-styles": () => true,
	},
	rules: {
		"cypress/no-unnecessary-waiting": 0,
		"cypress/no-assigning-return-values": 0,
		"no-bitwise": ["error"],
	},
};
