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
// import FilterBar from "./cases/FilterBar.svelte";
// import FilterQuery from "./cases/FilterQuery.svelte";
// import FilterSimpleQuery from "./cases/FilterSimpleQuery.svelte";
import Filters from "./cases/Filters.svelte";
import FiltersCustom from "./cases/FiltersCustom.svelte";
import FiltersCustomHandler from "./cases/FiltersCustomHandler.svelte";
import ExternalFilters from "./cases/ExternalFilters.svelte";
import FixedColumns from "./cases/FixedColumns.svelte";
import InlineEditors from "./cases/InlineEditors.svelte";
import InlineEditorsCells from "./cases/InlineEditorsCells.svelte";
import MultilineRows from "./cases/MultilineRows.svelte";
import Overlay from "./cases/Overlay.svelte";
import Paging from "./cases/Paging.svelte";
import Resize from "./cases/Resize.svelte";
import Reordering from "./cases/Reordering.svelte";
import RestBackend from "./cases/RestBackend.svelte";
import RowMultiSelection from "./cases/RowMultiSelection.svelte";
import RowSelection from "./cases/RowSelection.svelte";
import ScrollTable from "./cases/ScrollTable.svelte";
import SelectionCheckboxes from "./cases/SelectionCheckboxes.svelte";
import SizeToContainer from "./cases/SizeToContainer.svelte";
import SizeToContent from "./cases/SizeToContent.svelte";
import Sort from "./cases/Sort.svelte";
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


export const links = [
	["/base/:skin", "Basic DataGrid", BasicInit],
	[
		"/auto-config/:skin",
		"Automatically generated columns",
		AutoConfigColumns,
	],
	["/spans/:skin", "Header and footer spans", TableHeaderFooterSpans],
	["/fillspace/:skin", "Flexible column widths", FillspaceColumns],
	["/columns-to-content/:skin", "Column widths to content", ColumnsToContent],
	["/resize/:skin", "Resize columns", Resize],
	["/collapsible-columns/:skin", "Collapse columns", CollapsibleColumns],
	["/visibility/:skin", "Hide/show columns", VisibilityColumns],
	["/fixed/:skin", "Fixed columns", FixedColumns],
	[
		"/header-vertical/:skin",
		"Vertical text in header",
		TableHeaderFooterVertical,
	],

	["/size-container/:skin", "Size to container", SizeToContainer],
	["/size-content/:skin", "Size to content", SizeToContent],

	["/styling/:skin", "Styling", Styling],

	["/multiline-row/:skin", "Multi-line rows", MultilineRows],
	["/selection/:skin", "Row selection", RowSelection],
	["/multi-selection/:skin", "Multiple row selection", RowMultiSelection],
	[
		"/check-selection/:skin",
		"Selection with checkboxes",
		SelectionCheckboxes,
	],

	["/custom/:skin", "Custom cells", CustomCells],
	["/embedding-actions/:skin", "Custom cell actions", CustomEmbedingActions],
	["/tooltips/:skin", "Tooltips for data cells", Tooltips],

	["/editors/:skin", "Cell editors", InlineEditors],
	["/editors-custom/:skin", "Custom cell editors", InlineEditorsCells],
	["/editpanel/:skin", "Editor", ExternalEditor],
	[
		"/editpanel-comments/:skin",
		"Editor with Comments",
		ExternalEditorComments,
	],
	[
		"/editpanel-tasklist/:skin",
		"Editor with Tasklist",
		ExternalEditorTasklist,
	],

	["/reordering/:skin", "Reordering rows", Reordering],
	["/sort/:skin", "Sort data", Sort],
	// ["/filter/:skin", "Filter data with filter bar", FilterBar],
	// ["/filters/:skin", "Filter data with Simple Query", FilterSimpleQuery],
	// ["/query/:skin", "Filter data with Full Query", FilterQuery],
	["/filters/:skin", "Filters", Filters],
	["/filters-custom/:skin", "Filter settings", FiltersCustom],
	[
		"/filters-handler/:skin",
		"Filters with custom handler",
		FiltersCustomHandler,
	],
	["/filters-external/:skin", "External filters", ExternalFilters],
	["/pagination/:skin", "Pagination", Paging],

	["/context/:skin", "Context menu", ContextMenu],
	["/custom-context/:skin", "Custom context menu", CustomContextMenu],

	["/overlay/:skin", "Overlay", Overlay],
	["/bigdata/:skin", "Render big data", StaticData],
	["/dynamic/:skin", "Dynamic loading", DynamicData],
	["/rest/:skin", "REST backend", RestBackend],

	["/treetable/:skin", "Tree structure", TreeTable],


	["/api/:skin", "API calls", TableAPI],
	["/events/:skin", "Event handling", EventHandling],
	["/scroll/:skin", "Scroll by API", ScrollTable],
	["/print/:skin", "Print", Print],
	["/print-wide/:skin", "Print wide grid", PrintWideGrid],
	["/locale/:skin", "Locales", Localization],
];
