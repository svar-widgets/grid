import type { Component } from "svelte";
import Text from "./Text.svelte";
import Richselect from "./Richselect.svelte";
import DatePicker from "./DatePicker.svelte";
import MultiSelect from "./MultiSelect.svelte";

export const filters: Record<string, Component<any>> = {
	text: Text,
	richselect: Richselect,
	datepicker: DatePicker,
	multiselect: MultiSelect,
};
