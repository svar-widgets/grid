import Grid from "./components/Grid.svelte";
import HeaderMenu from "./components/menus/HeaderMenu.svelte";
import Tooltip from "./components/Tooltip.svelte";
import ContextMenu from "./components/menus/ContextMenu.svelte";
import { defaultMenuOptions } from "./helpers/menuOptions";

import Material from "./themes/Material.svelte";
import Willow from "./themes/Willow.svelte";
import WillowDark from "./themes/WillowDark.svelte";

export { getEditorConfig } from "wx-grid-store";

import { setEnv } from "wx-lib-dom";
import { env } from "wx-lib-svelte";
setEnv(env);

export {
	Grid,
	HeaderMenu,
	Tooltip,
	ContextMenu,
	defaultMenuOptions,
	Material,
	Willow,
	WillowDark,
};
