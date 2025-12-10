import type { TID } from "@svar-ui/lib-state";

export interface IButtonConfig {
	id?: TID;
	comp: string;
	text?: string;
	icon?: string;
	type?: string;
	menuText?: string;
}

export const defaultToolbarButtons: IButtonConfig[] = [
	{
		id: "add-row",
		comp: "button",
		icon: "wxi-plus",
		text: "New row",
		type: "primary",
	},
	{
		id: "open-editor",
		comp: "icon",
		icon: "wxi-edit",
		menuText: "Edit",
		text: "Edit",
	},
	{
		id: "delete-row",
		comp: "icon",
		icon: "wxi-delete",
		menuText: "Delete",
		text: "Delete",
	},
	{
		id: "copy-row",
		comp: "icon",
		icon: "wxi-content-copy",
		menuText: "Copy",
		text: "Copy",
	},
	{
		id: "cut-row",
		comp: "icon",
		icon: "wxi-content-cut",
		menuText: "Cut",
		text: "Cut",
	},
	{
		id: "paste-row",
		comp: "icon",
		icon: "wxi-content-paste",
		menuText: "Paste",
		text: "Paste",
	},
	{
		id: "move-item:up",
		comp: "icon",
		icon: "wxi-angle-up",
		menuText: "Move up",
		text: "Move up",
	},
	{
		id: "move-item:down",
		comp: "icon",
		icon: "wxi-angle-down",
		menuText: "Move down",
		text: "Move down",
	},
	{ comp: "separator" },
	{
		id: "undo",
		comp: "icon",
		icon: "wxi-undo",
		menuText: "Undo",
		text: "Ctrl+Z",
	},
	{
		id: "redo",
		comp: "icon",
		icon: "wxi-redo",
		menuText: "Redo",
		text: "Ctrl+Y",
	},
];
