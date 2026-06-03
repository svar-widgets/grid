<script>
	let { data } = $props();

	const stars = $derived.by(() => {
		const res = [];
		const max = 5;
		const n = Math.round((data.row.stars / 10000) * max);
		for (let i = 0; i < max; i++) {
			if (i < n) res.push({ filled: true });
			else res.push({});
		}

		return res;
	});
</script>

<div class="data">
	<div class="line">
		<b>Name:</b>
		{data.row.firstName}
		{data.row.lastName}
	</div>
	<div class="line"><b>City:</b> {data.row.city || "Unknown"}</div>
	<div class="line"><b>Email:</b> {data.row.email}</div>
	<div class="line">
		<b>Address:</b>
		{data.row.street}, {data.row.zipCode}
	</div>
	<div class="line stars">
		{#each stars as star}
			<i class="wxi-cat" class:filled={star.filled}></i>
		{/each}
		({data.row.stars})
	</div>
	<div class="line"><b>Followers:</b> {data.row.followers}</div>
</div>

<style>
	.data {
		padding: 10px;
		white-space: nowrap;
	}

	.line {
		padding-top: 4px;
	}

	.line.stars {
		display: flex;
		padding-top: 8px;
	}

	.wxi-cat {
		font-size: 20px;
	}

	.wxi-cat.filled {
		color: gold;
	}
</style>
