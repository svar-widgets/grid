<script>
	import {
		Field,
		Text,
		RichSelect,
		MultiCombo,
		DatePicker,
		Area,
		Checkbox,
		Switch,
	} from "@svar-ui/svelte-core";

	let { editors, data = null } = $props();
</script>

{#if data}
	{#each editors as editor}
		{#if editor.type === "combo"}
			<Field label={editor.label}>
				<RichSelect
					options={editor.options || []}
					bind:value={$data[editor.id]}
				/>
			</Field>
		{:else if editor.type === "multicombo"}
			<Field label={editor.label}>
				<MultiCombo
					textField="name"
					checkboxes={false}
					options={editor.options || []}
					bind:value={$data[editor.id]}
				/>
			</Field>
		{:else if editor.type === "datepicker"}
			<Field label={editor.label}>
				<DatePicker bind:value={$data[editor.id]} />
			</Field>
		{:else if editor.type === "textarea"}
			<Field label={editor.label}>
				<Area bind:value={$data[editor.id]} />
			</Field>
		{:else if editor.type === "switch"}
			<Field label={editor.label}>
				<Switch bind:value={$data[editor.id]} />
			</Field>
		{:else if editor.type === "checkbox"}
			<Field label={editor.label}>
				<Checkbox bind:value={$data[editor.id]} />
			</Field>
		{:else}
			<Field label={editor.label}>
				<Text bind:value={$data[editor.id]} />
			</Field>
		{/if}
	{/each}
{/if}
