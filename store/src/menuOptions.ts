export interface IDefaultMenuOption {
	id?: string;
	text?: string;
	icon?: string;
	comp?: "separator";
}

export const defaultMenuOptions: IDefaultMenuOption[] = [
	{ id: "add:before", text: "Add before", icon: "wxi-table-row-plus-before" },
	{ id: "add:after", text: "Add after", icon: "wxi-table-row-plus-after" },
	{ id: "copy", text: "Copy", icon: "wxi-content-copy" },
	{ comp: "separator" },
	{ id: "delete", text: "Delete", icon: "wxi-delete-outline" },
];
