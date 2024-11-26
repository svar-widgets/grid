<script>
	import { Button } from "wx-svelte-core";
	const { onaction } = $props();

	function showData() {
		onaction &&
			onaction({
				action: "overlay-button-click",
				data: {
					show: true,
				},
			});
	}
</script>

<div>Here is a component example</div>
<div>Click the button to see the data</div>
<Button type="primary" onclick={showData}>Show data</Button>
