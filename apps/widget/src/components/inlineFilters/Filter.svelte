<script lang="ts">
	import { getContext } from "svelte";
	import type {
		IHeaderFilter,
		IRenderColumn,
		TMethodsConfig,
	} from "@svar-ui/grid-store";
	import type { IInnerApi } from "../../types";
	import { filters } from "./filters";

	type Props = {
		filter: IHeaderFilter;
		column: IRenderColumn;
	};

	let { filter, column }: Props = $props();

	const api = getContext<IInnerApi>("grid-store");
	const { filterValues } = api.getReactiveState();

	function filterRows(data: TMethodsConfig["filter-rows"]) {
		api.exec("filter-rows", data);
	}

	const SvelteComponent = $derived(filters[filter.type]);
</script>

<SvelteComponent
	{filter}
	{column}
	action={filterRows}
	filterValue={$filterValues![column.id!]}
/>
