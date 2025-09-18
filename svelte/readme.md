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
[![Last Commit](https://img.shields.io/github/last-commit/svar-widgets/grid)](https://github.com/svar-widgets/grid)

</div>

[SVAR DataGrid](https://svar.dev/svelte/datagrid/) is an advanced Svelte component that enhances standard data tables, enabling you to create high-performance, feature-rich data grids that efficiently handle large data sets. Fully customizable, it supports inline editing, sorting, filtering, and virtual scrolling for optimal performance.

<div align="center">
  <img src="https://cdn.svar.dev/public/react-grid.png" alt="SVAR Svelte DataGrid - Screenshot" width="700">
</div>

### :sparkles: Key Features

-   High performance (virtual scrolling for rows and columns)
-   In-cell editing with different cell editors (datepicker, combo, select, rich select, etc.)
-   Custom HTML for cells
-   Sorting by multiple columns
-   Filtering
-   Paging
-   Fixed columns
-   Expandable/collapsible columns
-   Customizable tooltips for grid cells
-   Context menu
-   External editor for grid data
-   Tree-like structure
-   Print support
-   Responsive design to adapt to different screen/container sizes
-   Accessibility: compatibile with [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) standard
-   Keyboard navigation
-   RestDataProvider for easy backend data binding
-   Dark and light skins

### :hammer_and_wrench: How to Use

To use SVAR DataGrid, simply import the package and include the component in your Svelte file:

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

Join our [community forum](https://forum.svar.dev) to get help or post feature requests.
