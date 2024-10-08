describe("Vertical long text in header/footer", () => {
	it("Vertical long text in header/footer", () => {
		cy.visit(`/index.html#/header-spans-vertical-text-long/willow`);
		cy.viewport(1300, 975);
		cy.wait(1000);
		cy.shot(`header_spans_vertical_long`);

		cy.wxT("header").wxT("header-rows").should("have.length", 3);

		cy.wxT("header").wxT("header-cell", "First Name").should("be.visible");
		cy.wxT("header")
			.wxT("header-cell", "Email with long text")
			.should("be.visible");
		cy.wxT("header")
			.wxT("header-cell", "Stars with long long text")
			.should("be.visible");

		cy.wxT("footer").wxT("footer-rows").should("have.length", 3);

		cy.wxT("footer")
			.wxT("footer-cell", "Email with long text")
			.should("be.visible");
		cy.wxT("footer")
			.wxT("footer-cell", "Company long text")
			.should("be.visible");
		cy.wxT("footer")
			.wxT("footer-cell", "Stars with long long text")
			.should("be.visible");
	});
});
