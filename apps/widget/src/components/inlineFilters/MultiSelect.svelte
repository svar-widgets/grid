<script lang="ts">
	import { getContext } from "svelte";
	import { locale } from "@svar-ui/lib-dom";
	import { en } from "@svar-ui/grid-locales";
	import type { ILocale } from "@svar-ui/lib-dom";
	import type { TID } from "@svar-ui/lib-state";
	import type { IInlineFilterProps } from "../../types";
	import MultiSelectInput from "../MultiSelect.svelte";

	let { filter, column, action, filterValue }: IInlineFilterProps = $props();

	const _ =
		getContext<ILocale | undefined>("wx-i18n")?.getGroup("grid") ||
		locale(en).getGroup("grid");

	const config = $derived.by(() => {
		const obj = filter?.config || {};
		return { clear: true, ...obj };
	});
	let options = $derived(config.options || column.options);

	const text = $derived.by(() => {
		const len = filterValue?.length;
		if (!len) return "";
		if (len < 3)
			return filterValue
				.map((v: TID) => column.optionsMap!.get(v))
				.join(", ");
		return len + " " + _("selected");
	});

	function filterRows({ value }: { value: any }) {
		action({ value, key: column.id });
	}

	function handleKeyDown(ev: KeyboardEvent) {
		if (ev.key !== "Tab") ev.preventDefault();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style="width:100%;" onkeydown={handleKeyDown}>
	<MultiSelectInput
		placeholder={""}
		{...config}
		{options}
		value={filterValue || []}
		{text}
		onchange={filterRows}
	/>
</div>

<style>
	:global(.wx-cell.wx-filter div.wx-multiselect) {
		min-height: 28px;
		height: 28px;
	}
	:global(.wx-cell.wx-filter div.wx-multiselect .wx-label) {
		padding: 4px 8px;
	}
</style>
