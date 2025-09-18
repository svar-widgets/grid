import type {
	TID,
	IEventBus,
	IPublicWritable,
	IEventConfig,
} from "@svar-ui/lib-state";
import type { IDataMethodsConfig } from "./DataStore";
import type DataStore from "./DataStore";

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

export type TSelect = boolean;
export type TFilterType = "text" | "richselect";
export type TEditorType = "text" | "combo" | "datepicker" | "richselect";
export interface IColumnEditor {
	type: TEditorType;
	config?: {
		template?: (v: any) => string;
		cell?: any;
		options?: IOption[];
		buttons?: ["clear" | "today"];
	};
}
export type TEditorHandler = (
	row?: IRow,
	column?: IColumn
) => TEditorType | IColumnEditor | null;

export interface IConfig {
	data?: IRow[];
	sortMarks?: ISortMarks;
	selectedRows?: TID[];
	dynamic?: TDynamicConfig;
	sizes?: ISizeConfig;
	split?: {
		left?: number;
	};
	tree?: boolean;
	undo?: boolean;
	select?: TSelect;
}

interface IProConfig extends IConfig {
	split?: ISplitConfig;
}

export interface IDataConfig extends IProConfig {
	_filterIds?: TID[];
	_print?: IPrintConfig;
	_skin: TSkinName;
	columns?: IColumn[];
	scroll?: TScrollConfig;
	editor?: TEditorConfig;
	filterValues: IFilterValues;
	focusCell?: {
		row: TID;
		column: TID;
	};
	history?: {
		undo: number;
		redo: number;
	};
}

export interface IData extends IDataConfig {
	flatData: IRow[];
	_sizes: IRenderSizes;
	_columns: IRenderColumn[];
}

export interface IApi {
	exec: <A extends keyof TMethodsConfig | (string & {})>(
		action: A,
		params?: A extends keyof TMethodsConfig ? TMethodsConfig[A] : any
	) => Promise<any>;
	on: <A extends keyof TMethodsConfig | (string & {})>(
		action: A,
		callback: (
			config: A extends keyof TMethodsConfig ? TMethodsConfig[A] : any
		) => any,
		config?: IEventConfig
	) => void;
	intercept: <A extends keyof TMethodsConfig | (string & {})>(
		action: A,
		callback: (
			config: A extends keyof TMethodsConfig ? TMethodsConfig[A] : any
		) => any,
		config?: IEventConfig
	) => void;
	detach: (tag: IEventConfig["tag"]) => void;

	getState: () => IData;
	getReactiveState: () => {
		[Key in keyof IData]: IPublicWritable<IData[Key]>;
	};
	setNext: (ev: IEventBus<TMethodsConfig>) => void;
	getStores: () => { data: DataStore };
	getRow: (row: TID) => IRow;
	getColumn: (column: TID) => IColumn;
}

export interface IDataHash<T> {
	[key: string]: T;
}

export interface IColumn {
	id?: string;
	width?: number;
	flexgrow?: number;
	sort?: boolean;
	left?: number;
	right?: number;
	fixed?: number | { left?: number; right?: number };
	editor?: TEditorType | IColumnEditor | TEditorHandler;
	setter?: ValueSetter;
	getter?: ValueGetter;
	hidden?: boolean;
	resize?: boolean;
	options?: IOption[];
	optionsMap?: Map<TID, string>;
	header?: TColumnHeader;
	footer?: TColumnHeader;
	cell?: any;
	css?: string;
	template?: (value: any, row: IRow, col: IColumn) => string;
	treetoggle?: boolean;
	draggable?: boolean | ((row: IRow, column: IColumn) => boolean);
}

export type TColumnHeader = string | IHeaderCell | (string | IHeaderCell)[];

export interface IRenderColumn extends IColumn {
	header?: IRenderHeaderCell[];
	footer?: IRenderHeaderCell[];
	collapsed?: boolean;
	_colindex: number;
	editor?: IColumnEditor;
}

export interface IHeaderCell {
	id?: string;
	text?: string;
	cell?: any;
	css?: string;
	rowspan?: number;
	colspan?: number;
	collapsible?: boolean | "first" | "header";
	collapsed?: boolean;
	vertical?: boolean;
	autoheight?: boolean;
	filter?: TFilterType | IHeaderFilter;
}

export interface IRenderHeaderCell extends IHeaderCell {
	width: number;
	height?: number;
	flexgrow?: number;
	filter?: IHeaderFilter;
}

export interface ISizeConfig {
	rowHeight?: number;
	headerHeight?: number;
	footerHeight?: number;
	columnWidth?: number;
}

export interface ISplitConfig {
	left?: number;
	right?: number;
}

export interface IRenderSizes extends ISizeConfig {
	headerRowHeight?: number;
	headerRowHeights?: number[];
	footerRowHeights?: number[];
	columnWidth?: number;
}

export type TSortConfig = {
	key: string;
	order: string;
};

export type TEditorConfig = {
	id: TID;
	column: TID;
	value?: any;
	renderedValue?: any;
	config?: { [key: string]: any };
	options?: IColumn["options"];
};

export type TScrollConfig = {
	left: number;
	top: number;
	width: number;
	height: number;
};

export interface IOption {
	id: TID;
	label: string;
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
	[key in "cell" | "header" | "footer"]: {
		[key: string]: string;
	};
};

export type TConfigExportStyles = TExportStyles | string | boolean;

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
	styles?: TConfigExportStyles;
	cellTemplate?: (value: Value, row: IRow, column: IColumn) => string;
	headerCellTemplate?: (
		value: Value,
		headerCell: TColumnHeader,
		column: IColumn,
		type: TColumnType
	) => string;
	cellStyle?: (
		value: Value,
		row: IRow,
		column: IColumn
	) => IDataHash<any> | null;
	headerCellStyle?: (
		value: Value,
		headerCell: TColumnHeader,
		column: IColumn,
		type: TColumnType
	) => IDataHash<any> | null;
}

export type TColumnType = "header" | "footer";

export type TSortValue = string | number;
export type TSortObject = any;

export type TSkinName = "material" | "willow" | "willow-dark";

export type TDynamicConfig = {
	rowCount?: number;
	columnCount?: number;
};

export interface IHeaderFilter {
	type: TFilterType;
	config?: {
		template?: (opt: IOption) => string;
		options?: IOption[];
		handler?: TFilterHandler;
		placeholder?: string;
	};
}
export interface IFilterValues {
	[key: string]: any;
}

export interface ISortMarks {
	[key: string]: {
		order: "asc" | "desc";
		index?: number;
	};
}

export type TFilterHandler = (value: any, filter: any) => boolean;

export interface IPrintConfig {
	mode?: "portrait" | "landscape";
	ppi?: number;
	paper?: "a3" | "a4" | "letter";
}
