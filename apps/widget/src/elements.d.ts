// custom attributes the grid renders on its elements
declare module "svelte/elements" {
	interface HTMLAttributes<T> {
		// marks the handle a row can be dragged by
		"draggable-data"?: string;
	}
}

export {};
