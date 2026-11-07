import type { Component } from "svelte";
import type { TID } from "@svar-ui/lib-state";
import type {
	IApi,
	IColumn,
	IColumnEditor,
	IHeaderCell,
	IHeaderFilter,
	IRenderColumn,
	IRenderHeaderCell,
	IRow,
	TEditorConfig,
	TEditorType,
	TMethodsConfig,
} from "@svar-ui/grid-store";

// the action that custom cells and editors send up through onaction
export interface ICellAction {
	action?: any;
	data?: { [key: string]: any };
}

export interface IColumnEditorConfig extends IColumnEditor {
	config?: IColumnEditor["config"] & {
		cell?: Component<{
			data: any;
			onaction: (ev: ICellAction) => void;
		}>;
	};
}

// returns the editor for the cell, or nothing when the cell is not editable
export type TEditorHandlerConfig = (
	row?: IRow,
	column?: IColumn
) => TEditorType | IColumnEditorConfig | null | undefined;

// API shared with inner components and custom cells through the "grid-store" context
export type IInnerApi = Pick<
	IApi,
	"exec" | "getState" | "getReactiveState" | "getRow"
>;

// the columns that reach cells always have an id
type TCellColumn = IColumn & { id: TID };

export interface ICellProps {
	api: IInnerApi;
	row: IRow;
	column: TCellColumn;
	onaction: (ev: ICellAction) => void;
}

export interface IHeaderCellProps {
	api: IInnerApi;
	row: number;
	column: TCellColumn;
	cell: Omit<IHeaderCell, "cell">;
	onaction: (ev: ICellAction) => void;
}

export interface IHeaderCellConfig extends IHeaderCell {
	cell?: Component<IHeaderCellProps>;
}

export type TColumnHeaderConfig =
	| string
	| IHeaderCellConfig
	| (string | IHeaderCellConfig)[];

export interface IColumnConfig extends Omit<
	IColumn,
	"left" | "right" | "fixed" | "optionsMap" | "header" | "footer"
> {
	cell?: Component<ICellProps>;
	editor?: TEditorType | IColumnEditorConfig | TEditorHandlerConfig;
	header?: TColumnHeaderConfig;
	footer?: TColumnHeaderConfig;
}

// props the grid passes to inline editors, the built-in ones and registered ones
export interface IInlineEditorProps {
	editor: TEditorConfig;
	onsave: (ignoreFocus?: boolean) => void;
	// any truthy value, the click event included, keeps the focus off the cell
	oncancel: (ignoreFocus?: boolean | Event) => void;
	onapply: (value: any) => void;
	onaction: (ev: ICellAction) => void;
}

/* get component events from store actions */
type RemoveHyphen<S extends string> = S extends `${infer Head}-${infer Tail}`
	? `${Head}${RemoveHyphen<Tail>}`
	: S;

type EventName<K extends string> = `on${RemoveHyphen<K>}`;

export type GridActions<T extends Record<string, any> = TMethodsConfig> = {
	[K in keyof T as EventName<K & string>]?: (ev: T[K]) => void;
} & {
	[key: `on${string}`]: ((ev?: any) => void) | undefined;
};

// the column menu shares its column filter with the grid and its header cells
export interface IColumnMenuContext {
	readonly menuColumns: { [key: string]: boolean } | null;
}

// props of the inline filters in header cells
export interface IInlineFilterProps {
	filter: IHeaderFilter;
	column: IRenderColumn;
	action: (ev: TMethodsConfig["filter-rows"]) => void;
	filterValue: any;
}

// css class callbacks of the grid
export type TRowStyle = (row: IRow) => string;
export type TColumnStyle = (column: IColumn) => string;
export type TCellStyle = (row: IRow, column: IColumn) => string;

// a column as the grid body renders it: split columns get their position in
// fixed ({ left, right, leftSize }), -1 for the shadow column, 0 in the center
export type TLayoutColumn = Omit<IRenderColumn, "fixed"> & {
	fixed?: any;
};

// a header or footer cell as the grid renders it, with its position in the row
export type TLayoutHeaderCell = IRenderHeaderCell & {
	left?: number;
	right?: number;
};
