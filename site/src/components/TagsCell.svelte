<script>
	import { getData } from "../data/index";

	let { row, column } = $props();

	const tagsData = getData().tags;

	function getTags(data, value) {
		const result = [];

		for (let i = 0; i < data.length; i++) {
			const item = data[i];
			if (value.indexOf(item.id) !== -1) result.push(item);
			if (result.length === value.length) break;
		}

		return result;
	}
	let tags = $derived(getTags(tagsData, row[column.id]));
</script>

{#if tags.length}
	<div class="tags">
		<div class="tags-wrapper">
			{#each tags as tag (tag.id)}
				<span
					class="tag"
					style="background:{tag.background};color:{tag.color}"
				>
					{tag.label}
				</span>
			{/each}
		</div>
	</div>
{/if}

<style>
	.tags {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
	}
	.tags .tags-wrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.tags .tag {
		padding: 2px 12px;
		border-radius: 2px;
		width: fit-content;
		height: 24px;
	}
</style>
