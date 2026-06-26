import AutoConfigColumns from "./cases/AutoConfigColumns.svelte";
import BasicInit from "./cases/BasicInit.svelte";
import CollapsibleColumns from "./cases/CollapsibleColumns.svelte";
import ColumnsToContent from "./cases/ColumnsToContent.svelte";
import ContextMenu from "./cases/ContextMenu.svelte";
import CustomContextMenu from "./cases/CustomContextMenu.svelte";
import CustomCells from "./cases/CustomCells.svelte";
import CustomEmbedingActions from "./cases/CustomEmbedingActions.svelte";
import DynamicData from "./cases/DynamicData.svelte";
import EventHandling from "./cases/EventHandling.svelte";
import ExternalEditor from "./cases/ExternalEditor.svelte";
import ExternalEditorComments from "./cases/ExternalEditorComments.svelte";
import ExternalEditorTasklist from "./cases/ExternalEditorTasklist.svelte";
import FillspaceColumns from "./cases/FillspaceColumns.svelte";
import FilterBar from "./cases/FilterBar.svelte";
import FilterBuilder from "./cases/FilterBuilder.svelte";
import FilterQuery from "./cases/FilterQuery.svelte";
import Filters from "./cases/Filters.svelte";
import FiltersCustom from "./cases/FiltersCustom.svelte";
import FiltersCustomHandler from "./cases/FiltersCustomHandler.svelte";
import ExternalFilters from "./cases/ExternalFilters.svelte";
import FixedColumns from "./cases/FixedColumns.svelte";
import InlineEditors from "./cases/InlineEditors.svelte";
import InlineEditorsCells from "./cases/InlineEditorsCells.svelte";
import InlineEditorsHandler from "./cases/InlineEditorsHandler.svelte";
import InlineEditorsDisabled from "./cases/InlineEditorsDisabled.svelte";
import MultilineRows from "./cases/MultilineRows.svelte";
import Overlay from "./cases/Overlay.svelte";
import HotkeysCustom from "./cases/HotkeysCustom.svelte";
import Paging from "./cases/Paging.svelte";
import Resize from "./cases/Resize.svelte";
import Reordering from "./cases/Reordering.svelte";
import RestBackend from "./cases/RestBackend.svelte";
import RowMultiSelection from "./cases/RowMultiSelection.svelte";
import RowSelection from "./cases/RowSelection.svelte";
import ResponsiveMode from "./cases/ResponsiveMode.svelte";
import ScrollTable from "./cases/ScrollTable.svelte";
import SelectionCheckboxes from "./cases/SelectionCheckboxes.svelte";
import SizeToContainer from "./cases/SizeToContainer.svelte";
import SizeToContent from "./cases/SizeToContent.svelte";
import Sort from "./cases/Sort.svelte";
import SortCustom from "./cases/SortCustom.svelte";
import StaticData from "./cases/StaticData.svelte";
import Styling from "./cases/Styling.svelte";
import TableHeaderFooterSpans from "./cases/TableHeaderFooterSpans.svelte";
import TableHeaderFooterVertical from "./cases/TableHeaderFooterVertical.svelte";
import Tooltips from "./cases/Tooltips.svelte";
import VisibilityColumns from "./cases/VisibilityColumns.svelte";
import Localization from "./cases/Localization.svelte";
import TreeTable from "./cases/TreeTable.svelte";
import Print from "./cases/Print.svelte";
import PrintWideGrid from "./cases/PrintWideGrid.svelte";
import UndoRedo from "./cases/UndoRedo.svelte";
import Toolbar from "./cases/Toolbar.svelte";
import ToolbarCustom from "./cases/ToolbarCustom.svelte";
import CustomRowHeight from "./cases/CustomRowHeight.svelte";
import ExportCSV from "./cases/ExportCSV.svelte";


export const links = [
	["/base/:skin", "Basic DataGrid", BasicInit, "BasicInit"],
	["/bigdata/:skin", "Render big data", StaticData, "StaticData"],

	{ group: "Columns" },
	[
		"/auto-config/:skin",
		"Automatically generated columns",
		AutoConfigColumns,
		"AutoConfigColumns",
	],
	[
		"/fillspace/:skin",
		"Flexible column widths",
		FillspaceColumns,
		"FillspaceColumns",
	],
	[
		"/columns-to-content/:skin",
		"Column widths to content",
		ColumnsToContent,
		"ColumnsToContent",
	],
	["/fixed/:skin", "Pinned columns", FixedColumns, "FixedColumns"],
	["/resize/:skin", "Resize columns", Resize, "Resize"],
	[
		"/visibility/:skin",
		"Hide/show columns",
		VisibilityColumns,
		"VisibilityColumns",
	],
	[
		"/collapsible-columns/:skin",
		"Collapse columns",
		CollapsibleColumns,
		"CollapsibleColumns",
	],
	[
		"/spans/:skin",
		"Spans in header and footer",
		TableHeaderFooterSpans,
		"TableHeaderFooterSpans",
	],
	[
		"/header-vertical/:skin",
		"Vertical text in header",
		TableHeaderFooterVertical,
		"TableHeaderFooterVertical",
	],

	{ group: "Cells" },
	["/custom/:skin", "Custom cells", CustomCells, "CustomCells"],
	[
		"/embedding-actions/:skin",
		"Custom cell actions",
		CustomEmbedingActions,
		"CustomEmbedingActions",
	],
	["/tooltips/:skin", "Tooltips", Tooltips, "Tooltips"],
	["/editors/:skin", "Cell editors", InlineEditors, "InlineEditors"],
	[
		"/editors-custom/:skin",
		"Custom cell editors",
		InlineEditorsCells,
		"InlineEditorsCells",
	],
	[
		"/editors-different/:skin",
		"Different editors in a column",
		InlineEditorsHandler,
		"InlineEditorsHandler",
	],
	[
		"/editors-disabled/:skin",
		"Disabled cell editors",
		InlineEditorsDisabled,
		"InlineEditorsDisabled",
	],

	{ group: "Rows" },
	["/selection/:skin", "Row selection", RowSelection, "RowSelection"],
	[
		"/multi-selection/:skin",
		"Multiple row selection",
		RowMultiSelection,
		"RowMultiSelection",
	],
	[
		"/check-selection/:skin",
		"Selection with checkboxes",
		SelectionCheckboxes,
		"SelectionCheckboxes",
	],
	[
		"/custom-row-height/:skin",
		"Custom row heights",
		CustomRowHeight,
		"CustomRowHeight",
	],
	[
		"/multiline-row/:skin",
		"Auto row heights",
		MultilineRows,
		"MultilineRows",
	],
	["/reordering/:skin", "Reordering rows", Reordering, "Reordering"],
	["/treetable/:skin", "Tree rows", TreeTable, "TreeTable"],

	{ group: "Data operations" },
	["/filters/:skin", "Filters", Filters, "Filters"],
	[
		"/filters-custom/:skin",
		"Filter settings",
		FiltersCustom,
		"FiltersCustom",
	],
	[
		"/filters-handler/:skin",
		"Filters with custom handler",
		FiltersCustomHandler,
		"FiltersCustomHandler",
	],
	[
		"/filters-external/:skin",
		"External filters",
		ExternalFilters,
		"ExternalFilters",
	],
	["/filterbar/:skin", "Integration with FilterBar", FilterBar, "FilterBar"],
	[
		"/filterbuilder/:skin",
		"Integration with FilterBuilder",
		FilterBuilder,
		"FilterBuilder",
	],
	[
		"/filterquery/:skin",
		"Integration with FilterQuery",
		FilterQuery,
		"FilterQuery",
	],
	["/sort/:skin", "Sort data", Sort, "Sort"],
	[
		"/sort-custom/:skin",
		"Sort data with custom functions",
		SortCustom,
		"Custom data sorting",
	],
	["/pagination/:skin", "Pagination", Paging, "Paging"],
	["/undo-redo/:skin", "Undo/redo", UndoRedo, "UndoRedo"],
	["/events/:skin", "Action handlers", EventHandling, "EventHandling"],

	{ group: "UI / Interactions" },
	["/toolbar/:skin", "Toolbar: built-in", Toolbar],
	["/toolbar-custom/:skin", "Toolbar: custom", ToolbarCustom],
	["/context/:skin", "Context menu: built-in", ContextMenu, "ContextMenu"],
	[
		"/custom-context/:skin",
		"Context menu: custom",
		CustomContextMenu,
		"CustomContextMenu",
	],
	["/editpanel/:skin", "Editor", ExternalEditor, "ExternalEditor"],
	[
		"/editpanel-comments/:skin",
		"Editor with Comments",
		ExternalEditorComments,
		"ExternalEditorComments",
	],
	[
		"/editpanel-tasklist/:skin",
		"Editor with Tasklist",
		ExternalEditorTasklist,
		"ExternalEditorTasklist",
	],
	["/hotkeys-custom/:skin", "Custom hotkeys", HotkeysCustom, "HotkeysCustom"],
	["/scroll/:skin", "Scrolling", ScrollTable, "ScrollTable"],

	{ group: "Load & Save" },
	["/dynamic/:skin", "Dynamic loading", DynamicData, "DynamicData"],
	["/rest/:skin", "REST backend", RestBackend, "RestBackend"],
	["/export-csv/:skin", "Export to CSV", ExportCSV, "ExportCSV"],
	["/print/:skin", "Print", Print, "Print"],
	[
		"/print-wide/:skin",
		"Print: wide DataGrid",
		PrintWideGrid,
		"PrintWideGrid",
	],


	{ group: "Appearance" },
	["/styling/:skin", "Styling", Styling, "Styling"],
	[
		"/size-container/:skin",
		"Size to container",
		SizeToContainer,
		"SizeToContainer",
	],
	["/size-content/:skin", "Size to content", SizeToContent, "SizeToContent"],
	[
		"/responsive-mode/:skin",
		"Responsive mode",
		ResponsiveMode,
		"ResponsiveMode",
	],
	["/overlay/:skin", "Overlay", Overlay, "Overlay"],
	["/locale/:skin", "Locales", Localization, "Localization"],
];
