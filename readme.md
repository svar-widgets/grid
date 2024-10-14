## SVAR Svelte DataGrid 

SVAR Grid provides ready to use control for tabular data management

### :link: Useful Links

-   [Documentation](https://docs.svar.dev/svelte/grid/overview)
-   [How to start guide](https://docs.svar.dev/svelte/grid/getting_started/)
-   [Demos](https://docs.svar.dev/svelte/grid/samples/#/base/willow)

### :page_with_curl: License

SVAR Grid for Svelte is available under MIT license.

### How to Use

To use the widget, simply import the package and include the component in your Svelte file:

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
