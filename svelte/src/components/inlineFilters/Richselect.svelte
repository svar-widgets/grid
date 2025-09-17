<script>
	import { getContext } from "svelte";
	import { RichSelect } from "@svar-ui/svelte-core";
	import { getValue } from "@svar-ui/grid-store";

	let { filter, column, action, filterValue } = $props();

	const api = getContext("grid-store");
	const { flatData: data } = api.getReactiveState();

	let options = $derived(
		filter?.config?.options || column.options || getOptions($data)
	);
	let template = $derived(filter?.config?.template);

	function getOptions() {
		const options = [];
		$data.forEach(d => {
			const value = getValue(d, column);
			if (!options.includes(value)) options.push(value);
		});
		return options.map(opt => ({ id: opt, label: opt }));
	}

	function filterRows({ value }) {
		action({ value, key: column.id });
	}

	function handleKeyDown(ev) {
		if (ev.key !== "Tab") ev.preventDefault();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style="width:100%;" onkeydown={handleKeyDown}>
	<RichSelect
		placeholder={""}
		clear={true}
		{...filter.config ?? {}}
		{options}
		value={filterValue}
		onchange={filterRows}
	>
		{#snippet children(option)}
			{#if template}
				{template(option)}
			{:else}
				{option.label}
			{/if}
		{/snippet}
	</RichSelect>
</div>

<style>
	:global(.wx-cell.wx-filter div.wx-richselect) {
		min-height: 28px;
		height: 28px;
		padding: 4px 8px;
	}
	:global(.wx-cell.wx-filter div.wx-richselect .wx-label) {
		padding: 0;
	}
</style>
