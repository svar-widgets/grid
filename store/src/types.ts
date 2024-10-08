import type { IDataMethodsConfig } from "./DataStore";
import type { TID } from "wx-lib-state";

export type Value = string | number | Date;
export type DataHash = { [key: string]: Value };
export type ValueGetter = (obj: DataHash) => Value;
export type ValueSetter = (obj: DataHash, value: Value) => void;

export type TMethodsConfig = IDataMethodsConfig;

export type TDispatch = <A extends keyof TMethodsConfig>(
	action: A,
	data: TMethodsConfig[A]
) => void;

export interface IMethodsHash {
	[key: string]: any;
}

export interface IDataConfig {
	data: any[];
	columns: IColumn[];
	sort: TSortConfig[];
	filter?: (obj: any) => boolean;
	tree?: boolean;
	scroll?: null;
}

export interface IData {
	data: IRow[];
	flatData: IRow[];

	selected: TID;
	selectedRows: TID[];
	sizes: ISizeConfig;
	_sizes: IRenderSizes;
	columns: IColumn[];
	_columns: IColumn[];
	sort?: TSortConfig[];
	editor?: TEditorConfig;
	filter?: (obj: any) => boolean;
	tree?: boolean;
	scroll?: TScrollConfig;
	_skin: string;
	split: {
		left: number;
	};
}

export interface IDataHash<T> {
	[key: string]: T;
}

export interface IColumn {
	id: string;
	width: number;
	flexgrow?: number;
	$sort?: TSortConfig;
	sort?: boolean;
	left?: number;
	editor?: string | { type: string; config?: any };
	setter?: ValueSetter;
	getter?: ValueGetter;
	hidden?: boolean;
	options?: IOption[];
	optionsMap?: Map<TID, string>;
	header?: TColumnHeader;
	footer?: TColumnHeader;
	cell?: any;
	css?: string;
	template?: any;
	treetoggle?: boolean;
}

export type TColumnHeader = string | string[] | IHeaderConfig | IHeaderConfig[];

export interface IRenderColumn extends IColumn {
	header?: IRenderHeaderConfig[];
	footer?: IRenderHeaderConfig[];
	collapsed?: boolean;
}

export interface IHeaderConfig {
	id: string;
	text?: "";
	css?: string;
	rowspan?: number;
	colspan?: number;
	collapsible?: boolean | "first";
	collapsed?: boolean;
	vertical?: boolean;
	autoheight?: boolean;
}

export interface IRenderHeaderConfig extends IHeaderConfig {
	width: number;
	height?: number;
	flexgrow?: number;
}

export interface ISizeConfig {
	rowHeight?: number;
	headerHeight?: number;
	footerHeight?: number;
	colWidth?: number;
}

export interface IRenderSizes extends ISizeConfig {
	headerRowHeight?: number;
	headerRowHeights?: number[];
	footerRowHeights?: number[];
}

export type TSortConfig = {
	key: string;
	order: string;
	index?: number;
};

export type TEditorConfig = {
	id: TID;
	column: TID;
	value?: any;
	renderedValue?: any;
	config?: { [key: string]: any };
	options?: any[];
};

export type TScrollConfig = {
	left: number;
	top: number;
	width: number;
	height: number;
};

export interface IOption {
	id: TID;
	name: string;
}

export interface IRow {
	[key: string]: any;
}

export type IExportCell =
	| string
	| {
			v?: string;
			s?: number;
	  };

export interface IExportMerged {
	from: {
		row: number;
		column: number;
	};
	to: {
		row: number;
		column: number;
	};
}

export interface IExportColSize {
	width: number;
}

export interface IExportRowSize {
	height: number;
}

export type TExportStyles = {
	[key in
		| "cell"
		| "header"
		| "footer"
		| "lastHeaderCell"
		| "firstFooterCell"]: {
		[key: string]: string;
	};
};

export interface IExportOptions {
	format?: string;
	cdn?: string;
	header?: boolean;
	footer?: boolean;
	download?: boolean;
	fileName?: string;
	sheetName?: string;
	rows?: string;
	cols?: string;
	styles?: TExportStyles;
}

const header = "header";
const footer = "footer";

export type TColumnType = typeof header | typeof footer;

export type TSortValue = string | number;
export type TSortObject = any;
