<script>
	let { item } = $props();
</script>

<div>
	<div class="wx-icon" class:wx-hidden={!!item.hidden}>
		<i class="wxi-eye"></i>
	</div>
	<span>{item.text}</span>
</div>

<style>
	.wx-icon {
		display: inline-block;
		vertical-align: middle;
		margin-right: 4px;
	}

	.wx-hidden {
		color: var(--wx-color-font-disabled);
	}
</style>
