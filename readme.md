<div align="center">
	
# SVAR Svelte DataGrid | Data Table

</div>

<div align="center">

:globe_with_meridians: [Website](https://svar.dev/svelte/datagrid/) • :bulb: [Getting Started](https://docs.svar.dev/svelte/grid/getting_started/) • :eyes: [Demos](https://docs.svar.dev/svelte/grid/samples/#/base/willow)

</div>

<div align="center">

[![npm](https://img.shields.io/npm/v/wx-svelte-grid.svg)](https://www.npmjs.com/package/wx-svelte-grid)
[![License](https://img.shields.io/github/license/svar-widgets/grid)](https://github.com/svar-widgets/grid/blob/main/license.txt)
[![npm downloads](https://img.shields.io/npm/dm/wx-svelte-grid.svg)](https://www.npmjs.com/package/wx-svelte-grid)

</div>

**SVAR DataGrid** is a powerful and flexible Svelte component for building high-performance, feature-rich data grids. Designed to handle large datasets efficiently, it supports virtual scrolling, inline editing, sorting, filtering, and full customization to fit complex project needs.

<div align="center">
  <img src="https://cdn.svar.dev/public/react-grid.png" alt="SVAR Svelte DataGrid - Screenshot" width="700">
</div>

### :sparkles: Key Features

-   High performance (virtual scrolling and dynamic loading)
-   In-cell editing with different cell editors (datepicker, combo, select, rich select, etc.)
-   Custom HTML for cells
-   Sorting by multiple columns
-   Filtering
-   Paging
-   Accessibility: compatibility with [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) standard
-   Frozen columns
-   Expandable/collapsible columns
-   Row reordering with drag-and-drop
-   Customizable tooltips for grid cells
-   Context menu
-   External editor for grid data
-   Tree-like structure
-   Print support
-   Keyboard navigation
-   RestDataProvider for easy backend data binding
-   Dark and light skins

### :wrench: Svelte 4 and Svelte 5 versions

There are two versions of the datagrid library: the 1.x version, designed to work with Svelte 4, and the 2.x version, created for Svelte 5.

To use the SVAR DataGrid for Svelte 5, install it as follows:

```
npm install wx-svelte-grid
```

To use the SVAR DataGrid for Svelte 4:

```
npm install wx-svelte-grid@1.3.3
```

### :hammer_and_wrench: How to Use

To use SVAR DataGrid, simply import the package and include the component in your Svelte file:

```svelte
<script>
	import { Grid } from "wx-svelte-grid";

	const data = [
		{
			id: 12,
			name: "Alex Brown",
			year: 1974,
		},
	];
	const columns = [
		{
			id: "name",
			header: "Title",
			flexgrow: 1,
			sort: true,
			editor: "text",
		},
		{
			id: "year",
			header: "Year",
			width: 100,
			sort: true,
			editor: "text",
		},
	];
</script>

<Grid {data} {columns} />
```

For further instructions, see the detailed [how-to-start guide](https://docs.svar.dev/svelte/grid/getting_started).

### :computer: How to Modify

Typically, you don't need to modify the code. However, if you wish to do so, follow these steps:

1. Run `yarn` to install dependencies. Note that this project is a monorepo using `yarn` workspaces, so npm will not work
2. Start the project in development mode with `yarn start`

### :white_check_mark: Run Tests

To run the test:

1. Start the test examples with:
    ```sh
    yarn start:tests
    ```
2. In a separate console, run the end-to-end tests with:
    ```sh
    yarn test:cypress
    ```

### :speech_balloon: Need Help?

[Post an Issue](https://github.com/svar-widgets/grid/issues/) or use our [community forum](https://forum.svar.dev).
