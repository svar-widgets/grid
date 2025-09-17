import type { TID, IEventBus, IPublicWritable } from "@svar-ui/lib-state";
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
	};
}
export type TEditorHandler = (
	row?: IRow,
	column?: IColumn
) => TEditorType | IColumnEditor | null;

export interface IDataConfig {
	data: any[];
	columns: IColumn[];
	sortMarks: ISortMarks;
	_filterIds?: TID[];
	tree?: boolean;
	scroll?: null;
	editor?: TEditorConfig;
	dynamic?: TDynamicConfig;
	focusCell?: {
		row: TID;
		column: TID;
	};
	filterValues: IFilterValues;
	_print?: IPrintConfig;
	split: {
		left?: number;
		right?: number;
	};
	undo?: boolean;
	history?: {
		undo: number;
		redo: number;
	};
}

export interface IData {
	data: IRow[];
	flatData: IRow[];
	selectedRows: TID[];
	sizes: ISizeConfig;
	_sizes: IRenderSizes;
	columns: IColumn[];
	_columns: IRenderColumn[];
	sortMarks: ISortMarks;
	_filterIds?: TID[];
	editor?: TEditorConfig;
	tree?: boolean;
	scroll?: TScrollConfig;
	_skin: TSkinName;
	_select?: TSelect;
	split: {
		left?: number;
		right?: number;
	};
	dynamic?: TDynamicConfig;
	exportStyles?: TExportStyles;
	focusCell?: {
		row: TID;
		column: TID;
	};
	filterValues: IFilterValues;
	_print?: IPrintConfig;
	undo?: boolean;
	history?: {
		undo: number;
		redo: number;
	};
}

export interface IApi {
	exec: (action: keyof TMethodsConfig, params: any) => Promise<any>;
	on: (action: keyof TMethodsConfig, callback: (config: any) => any) => void;
	intercept: (
		action: keyof TMethodsConfig,
		callback: (config: any) => any
	) => void;
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
	id: string;
	width: number;
	flexgrow?: number;
	sort?: boolean;
	left?: number;
	editor?: TEditorType | IColumnEditor | TEditorHandler;
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
	draggable?: boolean | ((row: IRow, column: IColumn) => boolean);
}

export type TColumnHeader = string | string[] | IHeaderConfig | IHeaderConfig[];

export interface IRenderColumn extends IColumn {
	header?: IRenderHeaderConfig[];
	footer?: IRenderHeaderConfig[];
	collapsed?: boolean;
	_colindex: number;
	editor?: IColumnEditor;
}

export interface IHeaderConfig {
	id: string;
	text?: "";
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

export interface IRenderHeaderConfig extends IHeaderConfig {
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
	rowCount: number;
	columnCount: number;
};

interface IHeaderFilter {
	type: TFilterType;
	config?: {
		template?: (opt: any) => string;
		options?: { id: TID; label: "string" }[];
		handler?: TFilterHandler;
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
