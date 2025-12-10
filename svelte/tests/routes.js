import LocalData from "./cases/LocalData.svelte";
import HeaderMenu from "./cases/HeaderMenu.svelte";
import TableHeaderFooterSpans from "./cases/TableHeaderFooterSpans.svelte";
import PivotTableConfig from "./cases/PivotTableConfig.svelte";
import TreeMode from "./cases/TreeMode.svelte";
import VerticalText from "./cases/headerFooterVerticalText/VerticalText.svelte";
import SpansVerticalText from "./cases/headerFooterVerticalText/SpansVerticalText.svelte";
import SpansVerticalTextLong from "./cases/headerFooterVerticalText/SpansVerticalTextLong.svelte";
import CollapsibleColumns from "./cases/CollapsibleColumns.svelte";
import InlineEditors from "./cases/InlineEditors.svelte";
import TableHeaderFooterVertical from "./cases/TableHeaderFooterVertical.svelte";
import FixedColumns from "./cases/FixedColumns.svelte";
import FixedRightColumns from "./cases/FixedRightColumns.svelte";
import ContextMenu from "./cases/ContextMenu.svelte";
import CustomContextMenu from "./cases/CustomContextMenu.svelte";
import MenuOptions from "./cases/MenuOptions.svelte";
import ReorderingBasic from "./cases/ReorderingBasic.svelte";
import ReorderingHandlers from "./cases/ReorderingHandlers.svelte";
import SearchRows from "./cases/SearchRows.svelte";

export const links = [
	["/local-data/:skin", "", LocalData],
	["/header-menu/:skin", "", HeaderMenu],
	["/header-footer-spans/:skin", "", TableHeaderFooterSpans],
	["/pivot-config/:skin", "", PivotTableConfig],
	["/tree-mode/:skin", "", TreeMode],
	["/header-vertical-text/:skin", "", VerticalText],
	["/header-spans-vertical-text/:skin", "", SpansVerticalText],
	["/header-spans-vertical-text-long/:skin", "", SpansVerticalTextLong],
	["/collapsible-columns/:skin", "", CollapsibleColumns],
	["/inline-editors/:skin", "", InlineEditors],
	["/vertical-headers/:skin", "", TableHeaderFooterVertical],
	["/fixed-columns/:skin", "", FixedColumns],
	["/fixed-right/:skin", "", FixedRightColumns],
	["/context-menu/:skin", "", ContextMenu],
	["/custom-menu/:skin", "", CustomContextMenu],
	["/menu-options/:skin", "", MenuOptions],
	["/reordering-basic/:skin", "", ReorderingBasic],
	["/reordering-handlers/:skin", "", ReorderingHandlers],
	["/search-rows/:skin", "", SearchRows],
];
