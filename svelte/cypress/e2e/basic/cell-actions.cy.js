context("Custom cell and header actions", () => {
	it("Custom content should invoke API", () => {
		cy.visit(`/index.html#/embedding-actions/willow`);
		cy.wait(1000);
		cy.shot(`embedding-actions`);

		cy.wxT("table-row", 11).find(".table_icon").click();
		cy.wxT("menu").should("be.visible");
		cy.wxT("menu-item", "copy").click();
		cy.wxT("table-rows").should("have.length", 11);
		cy.get(".wx-notice .wxi-close").click();
		cy.wait(500);
		cy.shot("embedding-actions-copy");

		cy.wxT("header").wxT("header-row", 0).find(".wx-button").click();
		cy.wxT("table-rows").should("have.length", 12);
		cy.shot("embedding-actions-header-add");

		cy.wxT("header").wxT("header-row", 0).find(".wx-checkbox").click();
		cy.wxT("table")
			.find("input[type='checkbox']:checked")
			.should("have.length", 13);
		cy.get(".wx-notice .wxi-close").click();
		cy.shot("embedding-actions-header-check");

		cy.wxT("table-row", 12).find(".wx-checkbox").click();
		cy.wxT("header")
			.wxT("header-row", 0)
			.find("input[type='checkbox']:checked")
			.should("have.length", 0);

		cy.get(".wx-notice .wxi-close").click({ multiple: true });
		cy.wait(500);
		cy.shot("embedding-actions-header-uncheck");
	});
});
