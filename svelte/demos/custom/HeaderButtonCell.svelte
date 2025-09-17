<script>
	import { Button } from "@svar-ui/svelte-core";
	let { onaction } = $props();

	function onClick() {
		onaction &&
			onaction({
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
