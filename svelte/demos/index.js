import { mount } from "svelte";
import Demos from "./common/Index.svelte";

import Willow from "../src/themes/Willow.svelte";
import WillowDark from "../src/themes/WillowDark.svelte";

mount(Demos, {
	target: document.querySelector("#wx_demo_area") || document.body,
	props: {
		publicName: "Grid",
		productTag: "grid",
		skins: [
			{ id: "willow", label: "Willow", component: Willow },
			{ id: "willow-dark", label: "Dark", component: WillowDark },
		],
	},
});
