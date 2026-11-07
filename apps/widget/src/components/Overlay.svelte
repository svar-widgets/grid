<script lang="ts">
	import { getContext, type Component } from "svelte";
	import type { IInnerApi } from "../types";

	type Props = {
		overlay?: string | Component<any> | null;
	};

	let { overlay }: Props = $props();

	const api = getContext<IInnerApi>("grid-store");
	function isComponent(prop: Props["overlay"]): prop is Component<any> {
		return typeof prop === "function";
	}
</script>

<div class="wx-overlay">
	{#if isComponent(overlay)}
		{@const SvelteComponent = overlay}
		<SvelteComponent
			onaction={({ action, data }: { action: string; data?: any }) =>
				api.exec(action, data)}
		/>
	{:else}{overlay}{/if}
</div>

<style>
	.wx-overlay {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 5;
		background-color: var(--wx-background);
		padding: 14px 8px;
		text-align: center;
	}
</style>
