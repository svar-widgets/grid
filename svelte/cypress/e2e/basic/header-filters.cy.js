describe.only("Header filters functionality", () => {
	it("header filters", () => {
		cy.visit(`/index.html#/filters/willow`);
		cy.wait(1000);
		cy.shot(`header-filters`);

		cy.wxT("table")
			.first()
			.within(() => {
				cy.get(".wx-header input").first().type("er");
				cy.get(".wx-header input").first().should("have.value", "er");
				cy.wxT("table-rows").should("have.length", 4);

				cy.shot(`header-filters-filtered-data-text`);

				cy.get(".wx-header .wx-richselect").click();
				cy.get(".wx-header .wx-dropdown .wx-item").eq(1).click();
				cy.get(".wx-header input").first().should("have.value", "er");
				cy.get(".wx-header .wx-richselect .wx-label").should(
					"have.text",
					"Brasil"
				);
				cy.wxT("table-rows").should("have.length", 2);

				cy.get(".wx-header input").eq(1).type("le");
				cy.wxT("table-rows").should("have.length", 1);

				cy.shot(`header-filters-filtered-data-all`);

				cy.get(".wx-header input").eq(1).type("w");
				cy.get(".wx-header input").first().should("have.value", "er");
				cy.get(".wx-header input").eq(1).should("have.value", "lew");
				cy.wxT("table-rows").should("have.length", 0);

				// clear filters
				cy.get(".wx-header input").first().clear();
				cy.get(".wx-header input").eq(1).clear();
				cy.get(".wx-header .wx-richselect .wxi-close").click();

				cy.get(".wx-header input").first().should("have.value", "");
				cy.get(".wx-header input").eq(1).should("have.value", "");
				cy.get(".wx-header .wx-richselect .wx-label").should(
					"have.value",
					""
				);

				cy.shot(`header-filters-cleared-filters`);

				cy.get(".wx-header .wx-richselect").click();
				cy.get(".wx-header .wx-dropdown .wx-item").eq(3).click();
				cy.get(".wx-header .wx-richselect .wx-label").should(
					"have.text",
					"Germany"
				);
				cy.wxT("table-rows").should("have.length", 2);

				cy.shot(`header-filters-filtered-data-richselect`);
			});
	});
});
