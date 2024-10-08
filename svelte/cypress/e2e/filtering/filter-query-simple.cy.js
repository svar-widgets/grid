context("Filtering with Simple Query", () => {
	it.skip("Simple query should filter data by several fields with AND logic", () => {
		cy.visit(`/index.html#/filter-query-simple`);
		cy.wait(1000);
		cy.shot(`initial-query`);

		cy.get("button").contains("Add filter").click();
		cy.wxT("richselect-option", "City").click();
		cy.wxT("richselect-input", "equal").click();
		cy.wxT("richselect-option", "contains").click();
		cy.get("button").contains("Unselect all").click();
		cy.wxT("richselect-option", "Caleven").click();
		cy.wxT("richselect-option", "West Meda").click();
		cy.get("button").contains("Apply").click();
		cy.wait(500);
		cy.wxT("table-rows").should("have.length", 2);
		cy.wxT("table-row", 11).should("be.visible");
		cy.wxT("table-row", 18).should("be.visible");
		cy.shot("filtered-by-city");

		cy.get("button").contains("Add filter").click();
		cy.wxT("richselect-option", "Last Name").click();
		cy.wxT("richselect-input", "equal").click();
		cy.wxT("richselect-option", "begins with").click();
		cy.get("input").first().type("bar");
		cy.get("button").contains("Apply").click();
		cy.wait(500);
		cy.wxT("table-rows").should("have.length", 1);
		cy.wxT("table-row", 18).should("be.visible");
		cy.shot("filtered-by-city-and-last-name");

		cy.wxT("query-delete-icon").click();
		cy.wait(500);
		cy.wxT("table-rows").should("have.length", 1);
		cy.wxT("table-row", 18).should("be.visible");
		cy.shot("filtered-by-last-name");
	});
});
