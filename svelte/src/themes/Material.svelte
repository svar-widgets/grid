<script>
	import { Material } from "@svar-ui/svelte-core";
	let { fonts = true, children } = $props();
</script>

{#if children}
	<Material {fonts}>{@render children()}</Material>
{:else}
	<Material {fonts} />
{/if}

<style>
	:global(.wx-material-theme) {
		/*PLACE HERE*/

		--wx-table-select-background: #f0f0f0;
		--wx-table-select-color: var(--wx-color-font);
		--wx-table-border: 1px solid #dfdfdf;
		--wx-table-select-border: none;
		--wx-table-header-border: var(--wx-table-border);
		--wx-table-header-cell-border: var(--wx-table-border);
		--wx-table-footer-cell-border: var(--wx-table-border);
		--wx-table-cell-border: var(--wx-table-border);
		--wx-header-font-weight: 500;
		--wx-table-header-background: #fafafb;
		--wx-table-fixed-column-border: 3px solid #dfdfdf;
		--wx-table-editor-dropdown-border: none;
		--wx-table-editor-dropdown-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);
		--wx-table-drag-over-background: var(--wx-background-alt);
		--wx-table-drag-zone-shadow: var(--wx-box-shadow);
	}

	:global(.wx-material-theme .wx-table-menu) {
		box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);
		outline: none;
	}
</style>
