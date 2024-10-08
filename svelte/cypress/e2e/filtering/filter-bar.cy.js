context("Filtering with the Filter Bar", () => {
	it.skip("Filter bar should filter by one of several fields", () => {
		cy.visit(`/index.html#/filter-bar`);
		cy.wait(1000);
		cy.shot(`initial filter bar`);

		cy.get("input").type("eula");
		cy.wait(500);
		cy.wxT("table-row", 13).should("be.visible");
		cy.wxT("table-row", 15).should("be.visible");
		cy.wxT("table-row", 16).should("be.visible");
		cy.wxT("table-row", 17).should("be.visible");
		cy.wxT("table-rows").should("have.length", 4);
		cy.shot("filter-one");

		cy.get("button").contains("By city").click();
		cy.shot(`initial filter tab 2`);

		cy.get("input").type("darre");
		cy.wait(500);
		cy.wxT("table-row", 19).should("be.visible");
		cy.wxT("table-rows").should("have.length", 1);
		cy.shot("filter-two");

		cy.get("button").contains("By the field").click();
		cy.shot(`initial filter tab 3`);

		cy.wxT("filter-richselect").click();
		cy.wxT("richselect-option", "email").click();
		cy.get("input").type("hay");
		cy.wait(500);
		cy.wxT("table-row", 14).should("be.visible");
		cy.wxT("table-rows").should("have.length", 1);
		cy.shot("filter-three");
	});
});
