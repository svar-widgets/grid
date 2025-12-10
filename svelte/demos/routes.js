import AutoConfigColumns from "./cases/AutoConfigColumns.svelte";
import BasicInit from "./cases/BasicInit.svelte";
import CollapsibleColumns from "./cases/CollapsibleColumns.svelte";
import ColumnsToContent from "./cases/ColumnsToContent.svelte";
import ContextMenu from "./cases/ContextMenu.svelte";
import CustomCells from "./cases/CustomCells.svelte";
import CustomContextMenu from "./cases/CustomContextMenu.svelte";
import CustomEmbedingActions from "./cases/CustomEmbedingActions.svelte";
import DynamicData from "./cases/DynamicData.svelte";
import EventHandling from "./cases/EventHandling.svelte";
import ExternalEditor from "./cases/ExternalEditor.svelte";
import ExternalEditorComments from "./cases/ExternalEditorComments.svelte";
import ExternalEditorTasklist from "./cases/ExternalEditorTasklist.svelte";
import FillspaceColumns from "./cases/FillspaceColumns.svelte";
import FilterBar from "./cases/FilterBar.svelte";
import FilterBuilder from "./cases/FilterBuilder.svelte";
import FilterSimpleFilterBuilder from "./cases/FilterSimpleFilterBuilder.svelte";
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
import TableAPI from "./cases/TableAPI.svelte";
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
import ExternalToolbar from "./cases/ExternalToolbar.svelte";
import CustomRowHeight from "./cases/CustomRowHeight.svelte";


export const links = [
	["/base/:skin", "Basic DataGrid", BasicInit, "BasicInit"],
	[
		"/auto-config/:skin",
		"Automatically generated columns",
		AutoConfigColumns,
		"AutoConfigColumns",
	],
	[
		"/spans/:skin",
		"Header and footer spans",
		TableHeaderFooterSpans,
		"TableHeaderFooterSpans",
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
	["/resize/:skin", "Resize columns", Resize, "Resize"],
	[
		"/collapsible-columns/:skin",
		"Collapse columns",
		CollapsibleColumns,
		"CollapsibleColumns",
	],
	[
		"/visibility/:skin",
		"Hide/show columns",
		VisibilityColumns,
		"VisibilityColumns",
	],
	["/fixed/:skin", "Fixed columns", FixedColumns, "FixedColumns"],
	[
		"/header-vertical/:skin",
		"Vertical text in header",
		TableHeaderFooterVertical,
		"TableHeaderFooterVertical",
	],

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

	["/styling/:skin", "Styling", Styling, "Styling"],

	["/multiline-row/:skin", "Multi-line rows", MultilineRows, "MultilineRows"],
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

	["/custom/:skin", "Custom cells", CustomCells, "CustomCells"],
	[
		"/embedding-actions/:skin",
		"Custom cell actions",
		CustomEmbedingActions,
		"CustomEmbedingActions",
	],
	["/tooltips/:skin", "Tooltips for data cells", Tooltips, "Tooltips"],

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
		"Disabled cell inline editors",
		InlineEditorsDisabled,
		"InlineEditorsDisabled",
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

	["/reordering/:skin", "Reordering rows", Reordering, "Reordering"],
	["/sort/:skin", "Sort data", Sort, "Sort"],
	[
		"/sort-custom/:skin",
		"Custom data sorting",
		SortCustom,
		"Custom data sorting",
	],
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
	["/filterbar/:skin", "Filter data with FilterBar", FilterBar, "FilterBar"],
	[
		"/filterbuilder/:skin",
		"Filter data with FilterBuilder",
		FilterBuilder,
		"FilterBuilder",
	],
	[
		"/filtered-data/:skin",
		"Filter data before parsing",
		FilterSimpleFilterBuilder,
		"FilterSimpleFilterBuilder",
	],
	["/pagination/:skin", "Pagination", Paging, "Paging"],

	["/context/:skin", "Context menu", ContextMenu, "ContextMenu"],
	[
		"/custom-context/:skin",
		"Custom context menu",
		CustomContextMenu,
		"CustomContextMenu",
	],

	["/overlay/:skin", "Overlay", Overlay, "Overlay"],
	["/hotkeys-custom/:skin", "Custom Hotkeys", HotkeysCustom, "HotkeysCustom"],
	["/bigdata/:skin", "Render big data", StaticData, "StaticData"],
	["/dynamic/:skin", "Dynamic loading", DynamicData, "DynamicData"],
	["/rest/:skin", "REST backend", RestBackend, "RestBackend"],

	["/treetable/:skin", "Tree structure", TreeTable, "TreeTable"],


	["/api/:skin", "API calls", TableAPI, "TableAPI"],
	["/events/:skin", "Event handling", EventHandling, "EventHandling"],
	["/scroll/:skin", "Scroll by API", ScrollTable, "ScrollTable"],
	["/print/:skin", "Print", Print, "Print"],
	["/print-wide/:skin", "Print wide grid", PrintWideGrid, "PrintWideGrid"],
	["/locale/:skin", "Locales", Localization, "Localization"],
	["/undo-redo/:skin", "Undo/redo", UndoRedo, "UndoRedo"],
	["/toolbar/:skin", "Toolbar", Toolbar],
	["/toolbar-custom/:skin", "Toolbar: custom", ToolbarCustom],
	["/external-toolbar/:skin", "External Toolbar", ExternalToolbar],
	[
		"/custom-row-height/:skin",
		"Custom row heights",
		CustomRowHeight,
		"CustomRowHeight",
	],
];
