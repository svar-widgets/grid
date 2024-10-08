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
// import ExternalEditor from "./cases/ExternalEditor.svelte";
import FillspaceColumns from "./cases/FillspaceColumns.svelte";
// import FilterBar from "./cases/FilterBar.svelte";
// import FilterQuery from "./cases/FilterQuery.svelte";
// import FilterSimpleQuery from "./cases/FilterSimpleQuery.svelte";
import FixedColumns from "./cases/FixedColumns.svelte";
import InlineEditors from "./cases/InlineEditors.svelte";
import MultilineRows from "./cases/MultilineRows.svelte";
import Overlay from "./cases/Overlay.svelte";
import Paging from "./cases/Paging.svelte";
import Resize from "./cases/Resize.svelte";
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
	["/sort/:skin", "Sort data", Sort],
	// ["/filter/:skin", "Filter data with filter bar", FilterBar],
	// ["/filters/:skin", "Filter data with Simple Query", FilterSimpleQuery],
	// ["/query/:skin", "Filter data with Full Query", FilterQuery],
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
	["/locale/:skin", "Localization", Localization],
	// ["/editpanel", "External Editor", ExternalEditor],
];
