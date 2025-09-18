context("Responsive mode functionality", () => {
	it("resizes to 100% and verifies grid layout", () => {
		cy.visit(`/index.html#/responsive-mode/willow`);
		cy.wait(500);
		cy.viewport(1440, 800);
		cy.get(".wx-grid.wx-responsive-1000").should("not.exist");
		cy.get(".wx-grid.wx-responsive-600").should("not.exist");
		cy.shot(`responsive-width-100-percent`);
	});

	it("resizes to 600px and verifies hidden columns and styles", () => {
		cy.visit(`/index.html#/responsive-mode/willow`);
		cy.wait(500);
		cy.shot(`initial-responsive-mode`);
		cy.viewport(600, 800);
		cy.get(".wx-grid.wx-responsive-600").should("exist");
		cy.get(".wx-cell").should("have.css", "font-size", "16px");
		cy.wxT("header").wxT("header-cell", "First Name").should("exist");
		cy.wxT("header").wxT("header-cell", "Last Name").should("exist");
		cy.wxT("header").wxT("header-cell", "City").should("not.exist");
		cy.wxT("header").wxT("header-cell", "User ID").should("not.exist");
		cy.wxT("header").wxT("header-cell", "Email").should("not.exist");
		cy.wxT("header").wxT("header-cell", "Date").should("not.exist");

		cy.shot(`responsive-600`);
	});

	it("cycles through width changes using UI button", () => {
		cy.visit(`/index.html#/responsive-mode/willow`);
		cy.wait(500);
		cy.shot(`initial-responsive-mode`);

		cy.get("button").contains("Change width").click();
		cy.get(".wx-grid.wx-responsive-1000").should("exist");
		cy.shot(`change-width-to-1000`);

		cy.get("button").contains("Change width").click();
		cy.get(".wx-grid.wx-responsive-600").should("exist");
		cy.shot(`change-width-to-600`);

		cy.get("button").contains("Change width").click();
		cy.get(".wx-grid").should("have.class", "wx-responsive-1000");
		cy.get(".wx-grid").should("not.have.class", "wx-responsive-600");
		cy.wxT("header").wxT("header-cell", "First Name").should("exist");
		cy.wxT("header").wxT("header-cell", "Last Name").should("exist");
		cy.wxT("header").wxT("header-cell", "City").should("not.exist");
		cy.wxT("header").wxT("header-cell", "User ID").should("exist");
		cy.wxT("header").wxT("header-cell", "Email").should("not.exist");
		cy.wxT("header").wxT("header-cell", "Date").should("exist");
		cy.shot(`change-width-to-full`);
	});
});
