<script>
	import { Avatar } from "@svar-ui/svelte-core";

	let { row, data, column } = $props();
	const userData = $derived.by(() => {
		if (data) return data;
		const users = column.options;
		const options = row["assigned"]?.map(id =>
			users.find(user => user.id === id)
		);
		if (options?.length === 1) {
			return options[0];
		}
		return options;
	});

	const names = $derived.by(() => {
		if (Array.isArray(userData) && userData.length) {
			return userData.map(user => user.name).join(", ");
		}
		return "";
	});
</script>

<div class="container">
	{#key userData}
		{#if Array.isArray(userData)}
			{#if userData.length < 3}
				{names}
			{:else}
				<Avatar value={userData} size={22} />
			{/if}
		{:else}
			<Avatar value={userData} size={28} />
			<div>{userData?.name ?? ""}</div>
		{/if}
	{/key}
</div>

<style>
	.container {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 4px;
	}
</style>
