<script lang="ts">
	import type { Component, ComponentProps, Snippet } from "svelte";
	import { Combo } from "@svar-ui/svelte-core";
	import type { ICellProps } from "@svar-ui/svelte-grid";

	let { row, column, onaction }: ICellProps = $props();

	type TOption = { id: number; label: string };
	// core types declare Combo children without the { option } argument
	const OptionCombo = Combo as unknown as Component<
		Omit<ComponentProps<typeof Combo>, "children"> & {
			children?: Snippet<[{ option: TOption }]>;
		}
	>;

	const options: TOption[] = [
		{ id: 1, label: "New Amieshire" },
		{ id: 2, label: "New Gust" },
		{ id: 3, label: "Lefflerstad" },
		{ id: 4, label: "East Catalina" },
		{ id: 5, label: "Ritchieborough" },
	];

	const id = $derived.by(() => {
		const option = options.find(i => i.label === row[column.id!]);
		return option && option.id ? option.id : 1;
	});

	function onChange(ev: { value: string | number }) {
		const { value } = ev;
		onaction?.({
			action: "custom-combo",
			data: {
				value: options.find(i => i.id === value)!.label,
				column: column.id,
				row: row.id,
			},
		});
	}
</script>

<OptionCombo {options} value={id} onchange={onChange}>
	{#snippet children({ option })}
		{option.label}
	{/snippet}
</OptionCombo>
