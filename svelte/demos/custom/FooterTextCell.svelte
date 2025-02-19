<script>
	let { cell } = $props();
</script>

<div class="footer-content">
	<span>{cell.text}</span>
	<i class="wxi-check"></i>

	<style>
		.footer-content {
			display: flex;
			align-items: center;
			gap: 6px;
		}

		.footer-content i {
			display: inline-flex;
			font-size: 20px;
		}
	</style>
</div>
