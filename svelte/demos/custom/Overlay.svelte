<script>
	import { createEventDispatcher } from "svelte";

	import { Button } from "wx-svelte-core";

	const dispatch = createEventDispatcher();

	function showData() {
		dispatch("action", {
			action: "overlay-button-click",
			data: {
				show: true,
			},
		});
	}
</script>

<div>Here is a component example</div>
<div>Click the button to see the data</div>
<Button type="primary" click={showData}>Show data</Button>
