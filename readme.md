<div align="center">
	
# SVAR Svelte DataGrid | Data Table

</div>

<div align="center">

[Website](https://svar.dev/svelte/datagrid/) • [Getting Started](https://docs.svar.dev/svelte/grid/getting_started/) • [Demos](https://docs.svar.dev/svelte/grid/samples/#/base/willow)

</div>

<div align="center">

[![npm](https://img.shields.io/npm/v/@svar-ui/svelte-grid.svg)](https://www.npmjs.com/package/@svar-ui/svelte-grid)
[![License](https://img.shields.io/github/license/svar-widgets/grid)](https://github.com/svar-widgets/grid/blob/main/license.txt)
[![npm downloads](https://img.shields.io/npm/dm/@svar-ui/svelte-grid.svg)](https://www.npmjs.com/package/@svar-ui/svelte-grid)

</div>

**SVAR Svelte DataGrid** is a high-performance Svelte data grid component for building complex, interactive tables with large datasets. It supports virtual scrolling, in-cell editing, advanced filtering, and responsive mode out of the box. Comes with full Typescript support and a flexible API.

<div align="center">
  <img src="https://cdn.svar.dev/public/react-grid.png" alt="SVAR Svelte DataGrid - Screenshot" width="700">
</div>

### :sparkles: Key Features

SVAR Svelte DataGrid provides a rich set of features and multiple ways for customization:

-   High performance (virtual scrolling and dynamic loading)
-   In-cell editing with different cell editors (datepicker, combo, select, rich select, etc.)
-   External editor for grid data
-   Custom HTML for cells
-   Sorting by multiple columns
-   Advanced filtering (including natural language)
-   Paging
-   Frozen columns
-   Expandable/collapsible columns
-   Row reordering with drag-and-drop
-   Customizable tooltips for grid cells
-   Context menu
-   Built-in toolbar
-   Tree-like structure
-   Print support, export to CSV
-   Undo/redo
-   Keyboard navigation
-   Accessibility: compatibility with [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) standard
-   RestDataProvider for easy backend data binding
-   Dark and light skins, customizable with CSS (no Tailwind dependency)
-   Full TypeScript support

[Check the demos](https://docs.svar.dev/svelte/grid/samples/#/base/willow) to see how these features work.

### :wrench: Svelte 4 and Svelte 5 versions

There are two versions of the datagrid library: the 1.x version, designed to work with Svelte 4, and the 2.x version, created for Svelte 5.

To use the SVAR DataGrid for Svelte 5, install it as follows:

```
npm install @svar-ui/svelte-grid
```

To use the SVAR DataGrid for Svelte 4:

```
npm install wx-svelte-grid@1.3.3
```

### :hammer_and_wrench: How to Use

To use SVAR Svelte DataGrid, simply import the package and include the component in your Svelte file:

```svelte
<script>
	import { Grid } from "@svar-ui/svelte-grid";

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

### How to Modify

Typically, you don't need to modify the code. However, if you wish to do so, follow these steps:

1. Run `yarn` to install dependencies. Note that this project is a monorepo using `yarn` workspaces, so npm will not work
2. Start the project in development mode with `yarn start`

### Run Tests

To run the test:

1. Start the test examples with:
    ```sh
    yarn start:tests
    ```
2. In a separate console, run the end-to-end tests with:
    ```sh
    yarn test:cypress
    ```

### Need Help?

[Post an Issue](https://github.com/svar-widgets/grid/issues/) or use our [community forum](https://forum.svar.dev).

### ⭐ Show Your Support

If SVAR Svelte DataGrid helps your project, give us a star on GitHub! It helps more developers discover this component and keeps our team motivated to ship new features.
