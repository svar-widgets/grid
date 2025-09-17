<script>
	import { Button } from "@svar-ui/svelte-core";
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
