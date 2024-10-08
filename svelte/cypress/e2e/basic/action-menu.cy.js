context("Header menu functionality", () => {
	it("Header menu should hide and show columns", () => {
		cy.visit(`/index.html#/embedding-actions/willow`);
		cy.wait(1000);
		cy.shot(`embedding-actions`);

		cy.wxT("table-row", 11).find(".table_icon").click();
		cy.wxT("menu").should("be.visible");
		cy.wxT("menu-item", "copy").click();
		cy.wxT("table-rows").should("have.length", 11);
		cy.shot("embedding-actions-copy");
	});
});
