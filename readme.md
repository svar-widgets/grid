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


SVAR DataGrid is an advanced Svelte component that enhances standard data tables, enabling you to create high-performance, feature-rich data grids that efficiently handle large data sets. Fully customizable, it supports inline editing with a variety of cell editors to meet diverse project requirements.

<div align="center">
  <img src="https://cdn.svar.dev/public/react-grid.png" alt="SVAR Svelte DataGrid - Screenshot" width="700">
</div>


### :sparkles: Key Features

- High performance (virtual scrolling and dynamic loading)
- In-cell editing with different cell editors (datepicker, combo, select, rich select, etc.)
- Sorting by multiple columns
- Responsive design to adapt to different screen/container sizes
- Multiple row selection
- Fixed columns
- Expandable/collapsible columns
- Customizable tooltips for grid cells
- Context menu
- Tree-like structure
- Paging
- Export to CSV
- Keyboard navigation
- RestDataProvider for easy backend data binding
- Dark and light skins

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

