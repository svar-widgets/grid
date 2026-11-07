<script lang="ts">
	import { Button } from "@svar-ui/svelte-core";
	import type { IHeaderCellProps } from "@svar-ui/svelte-grid";

	let { onaction }: IHeaderCellProps = $props();

	function onClick() {
		onaction?.({
			action: "add-row",
			data: {
				row: {
					firstName: "John",
					lastName: "Smith",
					email: "realemail@gmail.com",
					city: "New York",
				},
			},
		});
	}
</script>

<Button type={"secondary"} icon="wxi-plus" onclick={onClick}>Add row</Button>
