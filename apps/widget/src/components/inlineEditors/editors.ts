import type { Component } from "svelte";
import type { IInlineEditorProps } from "../../types";
import Text from "./Text.svelte";
import Combo from "./Combo.svelte";
import Datepicker from "./Datepicker.svelte";
import Richselect from "./Richselect.svelte";
import Multiselect from "./MultiSelect.svelte";

export const editors: Record<string, Component<any>> = {
	text: Text,
	combo: Combo,
	datepicker: Datepicker,
	richselect: Richselect,
	multiselect: Multiselect,
};

export function registerInlineEditor(
	type: string,
	component: Component<IInlineEditorProps>
): void {
	editors[type] = component;
}
