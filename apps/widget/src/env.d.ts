/// <reference types="svelte" />
declare module "@svar-ui/grid-locales";

declare module "*.svelte" {
	import type { Component } from "svelte";
	const component: Component<any>;
	export default component;
}
