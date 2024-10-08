context("Basic functionality", () => {
	it("main views", () => {
		cy.visit(`/index.html#/collapsible-columns/willow`);
		cy.wait(1000);
		cy.shot(`collapsed-columns-first-mode`);

		cy.wxT("table-row", 11)
			.first()
			.find(".wx-cell")
			.should("have.length", 7);

		cy.get(".wx-collapse").first().click();
		cy.wxT("table-row", 11)
			.first()
			.find(".wx-cell")
			.should("have.length", 4);

		cy.get(".wx-vertical.wx-collapsed").first().click();
		cy.wxT("table-row", 11)
			.first()
			.find(".wx-cell")
			.should("have.length", 7);

		cy.get(".wx-collapse").eq(1).click();
		cy.wxT("table-row", 11)
			.first()
			.find(".wx-cell")
			.should("have.length", 6);

		cy.get(".wx-collapse").eq(1).click();
		cy.wxT("table-row", 11)
			.first()
			.find(".wx-cell")
			.should("have.length", 6);

		cy.shot(`collapsed-columns-first-mode-result`);

		cy.wxT("table-row", 11).eq(1).find(".wx-cell").should("have.length", 7);

		cy.get(".wx-collapse").eq(1).click();
		cy.wxT("table-row", 11).eq(1).find(".wx-cell").should("have.length", 5);

		cy.get(".wx-collapse").eq(2).click();
		cy.wxT("table-row", 11).eq(1).find(".wx-cell").should("have.length", 4);

		cy.shot(`collapsed-columns-none-mode-result`);
	});
});
