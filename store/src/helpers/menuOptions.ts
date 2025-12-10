import type { TID } from "@svar-ui/lib-state";

export interface IOptionConfig {
	id?: TID;
	text?: string;
	icon?: string;
	comp?: "separator";
}

export const defaultMenuOptions: IOptionConfig[] = [
	{
		id: "add-row:before",
		text: "Add before",
		icon: "wxi-table-row-plus-before",
	},
	{
		id: "add-row:after",
		text: "Add after",
		icon: "wxi-table-row-plus-after",
	},
	{
		id: "copy-row",
		text: "Copy",
		icon: "wxi-content-copy",
	},
	{
		id: "cut-row",
		text: "Cut",
		icon: "wxi-content-cut",
	},
	{
		id: "paste-row",
		text: "Paste",
		icon: "wxi-content-paste",
	},
	{
		id: "move-item:up",
		text: "Move up",
		icon: "wxi-angle-up",
	},
	{
		id: "move-item:down",
		text: "Move down",
		icon: "wxi-angle-down",
	},
	{ comp: "separator" },
	{ id: "delete-row", text: "Delete", icon: "wxi-delete-outline" },
];
