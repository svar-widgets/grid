describe("Vertical text in header/footer", () => {
	it("Vertical text in single header/footer row", () => {
		cy.visit(`/index.html#/header-vertical-text/willow`);
		cy.wait(1000);
		cy.shot(`header_vertical`);

		cy.wxT("header").wxT("header-rows").should("have.length", 1);

		cy.wxT("header")
			.wxT("header-row", 0)
			.children()
			.each((el, index) => {
				if (index !== 0) {
					cy.wrap(el).children().first().should("be.visible");
					cy.wrap(el).should("have.class", "wx-vertical");
				}
			});

		cy.wxT("footer").wxT("footer-rows").should("have.length", 1);
	});

	it("Vertical text in header spans", () => {
		cy.visit(`/index.html#/header-spans-vertical-text/willow`);
		cy.viewport(1300, 975);
		cy.wait(1000);
		cy.shot(`header_spans_vertical`);

		cy.wxT("header").wxT("header-rows").should("have.length", 3);

		cy.wxT("header")
			.wxT("header-cell", "First Name")
			.should("be.visible")
			.parent()
			.should("have.class", "wx-vertical");

		cy.wxT("header")
			.wxT("header-cell", "Last Name")
			.should("be.visible")
			.parent()
			.should("have.class", "wx-vertical");

		cy.wxT("header")
			.wxT("header-cell", "Stars with long text")
			.should("be.visible")
			.parent()
			.should("have.class", "wx-vertical");
	});
});
