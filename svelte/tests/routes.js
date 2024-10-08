import LocalData from "./cases/LocalData.svelte";
import HeaderMenu from "./cases/HeaderMenu.svelte";
import TableHeaderFooterSpans from "./cases/TableHeaderFooterSpans.svelte";
// import FilterBar from "./cases/FilterBar.svelte";
// import FilterQuery from "./cases/FilterQuery.svelte";
// import FilterSimpleQuery from "./cases/FilterSimpleQuery.svelte";
import PivotTableConfig from "./cases/PivotTableConfig.svelte";
import TreeMode from "./cases/TreeMode.svelte";
import VerticalText from "./cases/headerFooterVerticalText/VerticalText.svelte";
import SpansVerticalText from "./cases/headerFooterVerticalText/SpansVerticalText.svelte";
import SpansVerticalTextLong from "./cases/headerFooterVerticalText/SpansVerticalTextLong.svelte";
import CollapsibleColumns from "./cases/CollapsibleColumns.svelte";
import InlineEditors from "./cases/InlineEditors.svelte";
import TableHeaderFooterVertical from "./cases/TableHeaderFooterVertical.svelte";
import FixedColumns from "./cases/FixedColumns.svelte";
import ContextMenu from "./cases/ContextMenu.svelte";
import CustomContextMenu from "./cases/CustomContextMenu.svelte";
import MenuOptions from "./cases/MenuOptions.svelte";

export const links = [
	["/local-data/:skin", "", LocalData],
	["/header-menu/:skin", "", HeaderMenu],
	["/header-footer-spans/:skin", "", TableHeaderFooterSpans],
	["/pivot-config/:skin", "", PivotTableConfig],
	// ["/filter-bar/:skin", "", FilterBar ],
	// ["/filter-query/:skin", "", FilterQuery ],
	// ["/filter-query-simple/:skin", "", FilterSimpleQuery ],
	["/tree-mode/:skin", "", TreeMode],
	["/header-vertical-text/:skin", "", VerticalText],
	["/header-spans-vertical-text/:skin", "", SpansVerticalText],
	["/header-spans-vertical-text-long/:skin", "", SpansVerticalTextLong],
	["/collapsible-columns/:skin", "", CollapsibleColumns],
	["/inline-editors/:skin", "", InlineEditors],
	["/vertical-headers/:skin", "", TableHeaderFooterVertical],
	["/fixed-columns/:skin", "", FixedColumns],
	["/context-menu/:skin", "", ContextMenu],
	["/custom-menu/:skin", "", CustomContextMenu],
	["/menu-options/:skin", "", MenuOptions],
];
