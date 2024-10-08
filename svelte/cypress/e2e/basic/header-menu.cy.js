context("Header menu functionality", () => {
	it("Header menu should hide and show columns", () => {
		cy.visit(`/index.html#/header-menu/willow`);
		cy.wait(1000);
		cy.shot(`initial-header-menu`);

		cy.wxT("header").rightclick();
		cy.wxT("menu").should("be.visible");
		cy.shot(`header-menu-visible`);

		cy.wxT("menu").wxT("menu-item", "city").click();
		cy.wxT("header").wxT("header-cell", "City").should("be.visible");

		cy.wxT("header").rightclick();
		cy.wxT("menu").wxT("menu-item", "firstName").click();
		cy.wxT("header").wxT("header-cell", "First Name").should("not.exist");
	});
});
