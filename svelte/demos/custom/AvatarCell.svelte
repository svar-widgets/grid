<script>
	import { Cell } from "../../src";

	let { row, col, columnStyle, cellStyle } = $props();
</script>

<Cell {row} {col} {columnStyle} {cellStyle}>
	<div class="container">
		<div class="avatar">
			<div class="user-avatar">
				{#if row.avatar}
					<img class="user-photo" alt="" src={row.avatar} />
				{/if}
			</div>
		</div>
		<div class="info">
			<div class="name">{row.lastName}</div>
			<div class="mail">{row.email || ""}</div>
		</div>
	</div>
	<style>
		.container {
			display: flex;
			align-items: center;
			height: 56px;
			padding: 0 12px;
		}

		.avatar {
			width: 70px;
		}

		.name {
			flex: 1;
		}

		.mail {
			flex: 1;
		}

		.user-avatar {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background-color: #dfe2e6;
			text-align: center;
		}

		.user-photo {
			display: block;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			background-color: #dfe2e6;
		}
	</style>
</Cell>
