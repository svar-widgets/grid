<script lang="ts">
	import { Button } from "@svar-ui/svelte-core";
	import type { IHeaderCellProps } from "@svar-ui/svelte-grid";

	// the grid passes the usual header cell props; this cell doesn't use them
	let {}: IHeaderCellProps = $props();
</script>

<div class="header-content">
	<Button type={"secondary"} icon="wxi-alert" />
	<span>Custom header content</span>

	<style>
		.header-content {
			display: flex;
			align-items: center;
		}

		.header-content span {
			margin-left: 10px;
		}

		.header-content i {
			display: inline-flex;
			font-size: 20px;
		}
	</style>
</div>
