interface ShotConfig extends Partial<Cypress.ScreenshotOptions> {
	area?: string;
}

type WxTSelector =
	| "table"
	| "table-scroll"
	| "table-row"
	| "table-rows"
	| "table-cell"
	| "row-toggle"
	| "row-drag-handle"
	| "drag-zone"
	| "modal"
	| "button"
	| "header"
	| "header-cell"
	| "menu"
	| "menu-item"
	| "header-rows"
	| "header-row"
	| "footer"
	| "footer-rows"
	| "footer-row"
	| "footer-cell"
	| "filter-richselect"
	| "richselect-option"
	| "richselect-input"
	| "query-glue"
	| "query-menu-icon"
	| "query-menu-option"
	| "query-delete-icon";

type WxTSelectorWithId =
	| "table-row"
	| "table-cell"
	| "button"
	| "header-cell"
	| "menu-item"
	| "header-row"
	| "footer-row"
	| "footer-cell"
	| "richselect-option"
	| "richselect-input"
	| "query-menu-option";

type DragAction = "start" | "move" | "end";

declare namespace Cypress {
	interface Chainable<Subject> {
		/**
		 * Takes a screenshot with additional wait time added
		 * @param {...(string | ShotConfig)} args - Name segments or config object
		 * @example
		 * cy.shot("test-case")
		 * cy.shot("test-case", "mobile", { area: "#content" })
		 */
		shot(...args: (string | ShotConfig)[]): Chainable<void>;
		/**
		 * Perform drag operations on an element
		 * @param action - Type of drag action to perform
		 * @param position - Target position
		 * @param options - Configuration options for the drag action
		 * @example
		 * cy.get(".draggable").drag("start")
		 * cy.get(".draggable").drag("move", "bottom")
		 * cy.get(".draggable").drag("move", "center", { clientY: 100 })
		 * cy.get(".draggable").drag("end")
		 */
		drag(
			action: DragAction,
			position?: Cypress.PositionType,
			options?: Partial<Cypress.TriggerOptions>
		): Chainable<Subject>;
		/**
		 * Clicks an element without scrolling the viewport
		 * @param selector - Element to click
		 */
		clickNoScroll(selector: string): Chainable<void>;
		/**
		 * Select table elements using predefined selectors
		 * @param type - Type of element to select
		 * @param id - Optional identifier for specific elements
		 */
		wxT<T extends WxTSelector>(
			type: T,
			id?: T extends WxTSelectorWithId ? string | number : never
		): Chainable<JQuery<HTMLElement>>;
	}
}
