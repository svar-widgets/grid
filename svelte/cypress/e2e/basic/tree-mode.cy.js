context("Basic tree mode functionality", () => {
	it("main views", () => {
		cy.visit(`/index.html#/tree-mode/willow`);
		cy.wait(1000);
		cy.shot(`initial-tree`);

		cy.wxT("table-row", 1).wxT("row-toggle").click();
		cy.wxT("table-row", 2).wxT("row-toggle").click();
		cy.wxT("table-row", 3).wxT("row-toggle").click();
		cy.wxT("table-row", 4).wxT("row-toggle").click();
		cy.shot("table-tree-all-closed");
		cy.wxT("table-rows").should("have.length", 4);

		cy.wxT("table-row", 4).wxT("row-toggle").click();
		cy.wxT("table-rows").should("have.length", 11);

		cy.wxT("table-row", "4.2.2").wxT("row-toggle").click();
		cy.wxT("table-rows").should("have.length", 9);
	});
});
