context("Custom row heights", () => {
	it("can have custom row heights", () => {
		cy.visit(`/index.html#/custom-row-height/willow`);
		cy.wait(1000);

		cy.wxT("table-row", 3).should("have.css", "height", "50px");
		cy.wxT("table-row", 6).should("have.css", "height", "75px");
		cy.wxT("table-row", 8).should("have.css", "height", "100px");
		cy.shot(`custom-row-heights`);

		cy.get("button").eq(2).click();
		cy.wxT("table-row", 18)
			.should("be.visible")
			.should("have.css", "height", "100px");
		cy.shot(`custom-row-heights-scroll-to-18`);

		cy.get("button").eq(3).click();
		cy.wxT("table-row", 43)
			.should("be.visible")
			.should("have.css", "height", "50px");
		cy.shot(`custom-row-heights-scroll-to-43`);

		cy.get("button").eq(0).click();
		cy.wxT("table-row", 50).should("be.visible");
		cy.shot(`custom-row-heights-scroll-to-last`);

		cy.get("button").eq(1).click();
		cy.wxT("table-row", 1).should("be.visible");
		cy.shot(`custom-row-heights-scroll-to-first`);
	});
});
