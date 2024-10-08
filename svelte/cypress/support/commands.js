// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("shot", (...args) => {
	// eslint-disable-next-line cypress/no-unnecessary-waiting
	cy.wait(100);

	const name = args.filter(a => typeof a !== "object").join("-");
	const conf =
		typeof args[args.length - 1] === "object" ? args[args.length - 1] : {};
	const sconf = { ...conf, overwrite: true };

	if (conf.area) cy.get(conf.area).screenshot(name, sconf);
	else cy.screenshot(name, sconf);
});

Cypress.Commands.add(
	"clickNoScroll",
	{
		prevSubject: "element",
	},
	subject => {
		cy.wrap(subject).click({ scrollBehavior: false });
	}
);

Cypress.Commands.add(
	"wxT",
	{
		prevSubject: "optional",
	},
	(subject, type, id) => {
		subject = subject ? cy.wrap(subject) : cy;
		switch (type) {
			case "table":
				return subject.get(".wx-grid");
			case "table-row":
				return subject.get(`.wx-row[data-id="${id}"]`);
			case "table-rows":
				return subject.get(".wx-row");
			case "table-cell":
				return subject.find(".wx-cell").eq(id);
			case "row-toggle":
				return subject.find(".wx-table-tree-toggle");
			case "modal":
				return subject.get(".modal");
			case "button":
				return subject.get("button").contains(id);
			case "header":
				return subject.get(".wx-header");
			case "header-cell":
				return subject.get(".wx-cell").contains(id);
			case "menu":
				return subject.get(".wx-menu");
			case "menu-item":
				return subject.get(".wx-menu .wx-item[data-id='" + id + "']");
			case "header-rows":
				return subject.get(".wx-h-row");
			case "header-row":
				return subject.get(".wx-h-row").eq(id);
			case "footer":
				return subject.get(".wx-footer");
			case "footer-rows":
				return subject.get(".wx-f-row");
			case "footer-row":
				return subject.get(".wx-f-row").eq(id);
			case "footer-cell":
				return subject.get(".wx-cell").contains(id);
			case "filter-richselect":
				return subject.get(".select").first();
			case "richselect-option":
				return subject.get(".wx-item").contains(id);
			case "richselect-input":
				return subject.get(".label").contains(id);
			case "query-glue":
				return subject.get(".glue");
			case "query-menu-icon":
				return subject.get(".menu-icon").first();
			case "query-menu-option":
				return subject.get(".value").contains(id);
			case "query-delete-icon":
				return subject.get(".wxi-delete").first();

			default:
				throw `not supported arguments for wxT: ${type}, ${id}`;
		}
	}
);
