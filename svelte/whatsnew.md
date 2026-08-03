## 2.7.2

### Updates

-   Ability to use native HTML5 drag-n-drop with grid rows

### Fixes

-   Inconsistent focus behavior and redundant "update-cell" event on inline editors
-   Error with `autoRowHeight` when the DataGrid runs in a SvelteKit app

## 2.7.1

### Fixes

-   Header colspans are clipped when start column is hidden
-   Grid cell focus is lost during key navigation
-   Resize marker goes above the fixed column
-   Horizontal scroll is corrupt if at least one column is flexible
-   Vertical header cell is missing when collapsing a pinned column
-   The "resize-column" handler sets fixed width with no ability to retain flexible behaviour

## 2.7.0

### New features

-   Multi-select filter for grid columns
-   Scroll-to action to force and listen to scroll movements

### Updates

-   Extra Tooltip settings: arrow, delay, at, overlow, etc
-   Ability to set input type for "text" editor

### Fixes

-   Closing an inline editor by clicking on another cell doesn't focus the cell clicked
-   Incorrect type for header cells
-   Columns flicker when a new row is added in a Grid with flexgrow

### Breaking changes

-   Parameters of Tooltip content component changed from `{ row, column }` to `{ data: row, column } `

## 2.6.2

### Fixes

-   Incorrect type for `filterValues`
-   Multiselect editor value is not applied

## 2.6.1

### Fixes

-   Impossible to configure inline editor dropdown
-   Inline editor dropdown is detached during scroll
-   Editor state object is mutated instead of being reset
-   DataProvider adds trailing slash to getData url
-   Incorrect height of sidebar Editor

## 2.6.0

### New features

-   Multiselect inline editor
-   Ability to register custom inline editors

### Updates

-   Integration with FilterQuery

### Fixes

-   Dropdown editors are cut off in small tables
-   DataGrid fails to initialize in SvelteKit with serverside rendering
-   Error in fetching Typescript definitions from store

## 2.5.1

### Fixes

-   Items with string ids fail in some operations
-   Multiple sorting and selection does not work on MacOs

## 2.5.0

### New features

-   Export to CSV

### Fixes

-   Text filtering fails for numeric values

## 2.4.0

### New features

-   Toolbar for common operations
-   Ability to define custom row height
-   Ability to provide a custom function for sorting rows

### Updates

-   Extra options for ContextMenu: Copy/Cut/Paste, Move up and down

### Fixes

-   Switching ContextMenu locale
-   Correct triggers for select and focus action
-   Print view contains initial HTML
-   Performance enhancements

## 2.3.0

### New features

-   TypeScript definitions

### Fixes

-   Default locale is not applied to ContextMenu

## 2.2.0

### New features

-   Undo/redo for data and column actions
-   Ability to tune responsive behaviour
-   Dynamic inline editors for column cells
-   Integration with SVAR Filter

### Updates

-   Non-persistent filtering: table is not re-filtered on data changes

### Fixes

-   Inline "date" editor is not closed on Enter key
-   Shift+tab hotkey makes extra step with inline editors
-   Enter hotkey calls "open-row" action for non-branches in `tree` mode
-   Changing any property reverts data in `tree` mode

### Breaking changes

-   `sort` state property renamed to `sortMarks`

## 2.1.5

### Fixes

-   Resize observer error in corner cases

## 2.1.4

### Fixes

-   Filters are cleared when other properties change
-   Regression in paddings of collapsible columns

## 2.1.3

### Fixes

-   Regression with table borders

## 2.1.2

### Fixes

-   Up/down navigation on dynamic data: selected node hides under header/footer
-   Incorrect position of sort markers when sorting by multiple columns
-   Fully collapsed columns invoke unneeded scrollbars

## 2.1.1

### Fixes

-   Data with empty fields is filtered out when filters are cleared
-   Column sorting should use `getter` to get field value

## 2.1.0

### New features

-   Accessibility: compatibility with WAI-ARIA standard
-   Built-in filters in header
-   Row reordering via drag-n-drop
-   Print support
-   Focus management API
-   Custom content for header and footer cells

### Updates

-   Improved key navigation
-   Extra parameters to filter-rows action
-   Custom content for combo editor options
-   Clickable vertical overlay for fully collapsed columns

### Fixes

-   HeaderMenu breaks scrolling
-   Richselect editor dropdown goes over footer
-   Tree node marker is not changed when opening and closing

### Breaking changes

-   `handler` parameter renamed to filter for the `filter-rows` action
-   `colWidth` parameter renamed to `columnWidth` for the `sizes` property
-   `rowsCount` and `colsCount` parameters renamed to `rowCount` and `columnCount` for the `dynamic` property
-   `col` renamed to `column` for `$props` received by custom cell content
-   no need to import and use `Cell` when embedding custom components

## 2.0.1

### New features

-   Svelte 5 support

### Breaking changes

-   `data-request` event renamed to `request-data`
-   property `selected` removed

## 1.3.3

### Fixes

-   Treetable data is not fully shown in some cases
-   Too narrow column width if autowidth is set
-   Typos in type definitions

## 1.3.2

### Fixes

-   Editors in tree mode are not applied correctly
-   `.ts` definitions are not precise

## 1.3.0

### Updates

-   More convenient way of using the built-in and external ContextMenu

## 1.2.4

### Fixes

-   [fix] DataProvider package is not compatible with react toolchain

## 1.2.3

-   Usiing core@1.2.3

## 1.2.0

### Updates

-   Exposing `flatData` state property

### Fixes

-   Further improvements for column auto-sizing in tree structure
-   Column auto-sizing and sorting markers

## 1.1.3

### Updates

-   Sorting for hierarchical datasets
-   Display sort marker for the last header row only

### Fixes

-   Column auto-sizing in in tree structure
-   Resizing columns with flexgrow
-   Text overflow for vertical headers
-   Impossible to define the initial selection
-   Table editor doesn't reflect changes in the related state properties
-   Error after collapsing the first column in table

## 1.0.0

Initial version released
