import Grid from "./components/Grid.svelte";
import HeaderMenu from "./components/menus/HeaderMenu.svelte";
import Tooltip from "./components/Tooltip.svelte";
import ContextMenu from "./components/menus/ContextMenu.svelte";
import ColumnMenu from "./components/menus/ColumnMenu.svelte";
import Toolbar from "./components/Toolbar.svelte";
import Willow from "./themes/Willow.svelte";
import WillowDark from "./themes/WillowDark.svelte";

export {
	getEditorConfig,
	defaultMenuOptions,
	defaultColumnMenuOptions,
	defaultToolbarButtons,
} from "@svar-ui/grid-store";

import { setEnv } from "@svar-ui/lib-dom";
import { env } from "@svar-ui/lib-svelte";
setEnv(env);

export { registerInlineEditor } from "./components/inlineEditors/editors";

export {
	Grid,
	HeaderMenu,
	Tooltip,
	ContextMenu,
	ColumnMenu,
	Toolbar,
	Willow,
	WillowDark,
};

export type * from "@svar-ui/grid-store";
export type {
	ICellAction,
	IColumnEditorConfig,
	TEditorHandlerConfig,
	IInnerApi,
	ICellProps,
	IHeaderCellProps,
	IHeaderCellConfig,
	TColumnHeaderConfig,
	IColumnConfig,
	IInlineEditorProps,
	GridActions,
} from "./types";
