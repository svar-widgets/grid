import Grid from "./components/Grid.svelte";
import HeaderMenu from "./components/menus/HeaderMenu.svelte";
import Tooltip from "./components/Tooltip.svelte";
import ContextMenu from "./components/menus/ContextMenu.svelte";
import { defaultMenuOptions } from "./helpers/menuOptions";

import Material from "./themes/Material.svelte";
import Willow from "./themes/Willow.svelte";
import WillowDark from "./themes/WillowDark.svelte";

export { getEditorConfig } from "@svar-ui/grid-store";

import { setEnv } from "@svar-ui/lib-dom";
import { env } from "@svar-ui/lib-svelte";
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
