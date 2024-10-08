context("Header and footer colspans and rowspans", () => {
	it("main views", () => {
		cy.visit(`/index.html#/header-footer-spans/willow`);
		cy.viewport(1300, 975);
		cy.wait(1000);
		cy.shot(`crazy-spans`);

		cy.wxT("header").wxT("header-rows").should("have.length", 3);
		cy.wxT("footer").wxT("footer-rows").should("have.length", 3);
	});
});
