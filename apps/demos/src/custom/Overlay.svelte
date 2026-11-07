<script lang="ts">
	import { Button } from "@svar-ui/svelte-core";
	import type { ICellAction } from "@svar-ui/svelte-grid";

	type Props = {
		onaction?: (ev: ICellAction) => void;
	};

	const { onaction }: Props = $props();

	function showData() {
		onaction?.({
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
