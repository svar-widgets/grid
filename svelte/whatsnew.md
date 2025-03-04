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
