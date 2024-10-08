<script>
	import ThemeSelect from "./ThemeSelect.svelte";
	import Component from "./Component.svelte";

	export let skin;
	function selectSkin(ev) {
		skin = ev.detail.selected.id;
	}
</script>

<div class="demo" style="padding: 10px 20px;">
	<div class="toolbar">
		<div class="control">
			<span>Theme</span>
			<ThemeSelect bind:value={skin} on:select={selectSkin} />
		</div>
	</div>
	<div class="bottom">
		<Component />
	</div>
</div>

<style>
	.demo {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.bottom {
		flex: 1;
		height: 100%;
		overflow: hidden;
	}
	.toolbar {
		height: 32px;
		margin-bottom: 8px;
		display: flex;
		justify-content: flex-end;
	}
	.control {
		width: 212px;
		display: flex;
		gap: 8px;
		align-items: center;
	}
</style>
