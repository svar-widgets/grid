<script>
	export let data;
</script>

<div class="status {data.type}">
	<div class="status-wrapper">
		<div class="dot" />
		<span class="name">{data.name}</span>
	</div>
</div>

<style>
	.status {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
	}
	.status .status-wrapper {
		border-radius: 18px;
		padding: 2px 8px;
		display: flex;
		gap: 4px;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.status .status-wrapper::before {
		position: absolute;
		height: 100%;
		width: 100%;
		content: "";
		border-radius: 18px;
		opacity: 0.15;
	}
	.status .dot {
		height: 6px;
		width: 6px;
		border-radius: 50%;
	}

	.status.success .status-wrapper::before,
	.status.success .dot {
		background: var(--wx-color-success);
	}
	.status.primary .status-wrapper::before,
	.status.primary .dot {
		background: var(--wx-color-primary);
	}
	.status.disabled .status-wrapper::before,
	.status.disabled .dot {
		background: var(--wx-color-font-alt);
	}
	.status.success .name {
		color: var(--wx-color-success);
	}
	.status.primary .name {
		color: var(--wx-color-primary);
	}
	.status.disabled .name {
		color: var(--wx-color-font-alt);
	}
</style>
