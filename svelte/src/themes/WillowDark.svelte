<script>
	import { WillowDark } from "wx-svelte-core";
	const SLOTS = $$props.$$slots;
	export let fonts = true;
</script>

{#if SLOTS && SLOTS.default}
	<WillowDark {fonts}>
		<slot />
	</WillowDark>
{:else}
	<WillowDark {fonts} />
{/if}

<style>
	:global(.wx-willow-dark-theme) {
		/*PLACE HERE*/
		color-scheme: dark;

		--wx-table-select-background: #384047;
		--wx-table-select-focus-background: #465059;
		--wx-table-select-color: var(--wx-color-font);
		--wx-table-border: var(--wx-border);
		--wx-table-select-border: inset 3px 0 var(--wx-color-primary);
		--wx-table-header-border: var(--wx-table-border);
		--wx-table-header-cell-border: var(--wx-table-border);
		--wx-table-footer-cell-border: var(--wx-table-border);
		--wx-table-cell-border: var(--wx-table-border);
		--wx-header-font-weight: 600;
		--wx-table-header-background: #20262b;
		--wx-table-fixed-column-right-border: 3px solid var(--wx-background-alt);
		--wx-table-editor-dropdown-border: var(--wx-border);
		--wx-table-editor-dropdown-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.6);
	}

	:global(.wx-willow-dark-theme .wx-table-menu) {
		box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.6);
		outline: var(--wx-border);
	}
</style>
