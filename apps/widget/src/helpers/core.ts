import type { Component, ComponentProps, Snippet } from "svelte";
import { RichSelect, SuggestDropdown } from "@svar-ui/svelte-core";

// core 2.6.1 types declare these children snippets without the arguments
// the components pass to them; the aliases are the same components

export const OptionRichSelect = RichSelect as unknown as Component<
	Omit<ComponentProps<typeof RichSelect>, "children"> & {
		children?: Snippet<[any]>;
	}
>;

export const OptionSuggestDropdown = SuggestDropdown as unknown as Component<
	Omit<ComponentProps<typeof SuggestDropdown>, "children"> & {
		children?: Snippet<[{ option: any }]>;
		// passed on to the inner Dropdown with the other props
		oncancel?: (ev?: MouseEvent) => void;
	}
>;

export type TNavigate = (dir: number | null, ev?: KeyboardEvent) => void;
export type TKeydown = (ev: KeyboardEvent, dir: number) => void;
