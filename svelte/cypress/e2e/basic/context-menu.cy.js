context("Context menu functionality", () => {
	it("Default context menu works", () => {
		cy.visit(`/index.html#/context-menu/willow`);
		cy.wait(1000);
		cy.shot(`initial-menu`);

		cy.wxT("table-row", 12).rightclick();
		cy.wxT("menu").should("be.visible");
		cy.shot(`context-menu-visible`);

		cy.wxT("menu-item", "add:before").click();
		cy.wxT("table-rows").should("have.length", 11);
		cy.shot("context-add-before");

		cy.wxT("table-row", 12).rightclick();
		cy.wxT("menu-item", "add:after").click();
		cy.wxT("table-rows").should("have.length", 12);
		cy.shot("context-add-after");

		cy.wxT("table-row", 12).rightclick();
		cy.wxT("menu-item", "copy").click();
		cy.wxT("table-rows").should("have.length", 13);
		cy.shot("context-copy");

		cy.wxT("table-row", 19).rightclick();
		cy.wxT("menu-item", "delete").click();
		cy.wxT("table-rows").should("have.length", 12);
		cy.shot("context-delete");
	});

	it("Default context menu works", () => {
		cy.visit(`/index.html#/menu-options/willow`);
		cy.wait(1000);
		cy.shot(`menu-options`);

		cy.wxT("table-row", 12).rightclick();
		cy.wxT("menu-item", "add:after").click();
		cy.wxT("table-rows").should("have.length", 11);
		cy.shot("context-add-after-menu-options");

		cy.wxT("table-row", 12).rightclick();
		cy.wxT("menu-item", "info").click();
		cy.get(".wx-notice").should("be.visible");
	});

	it("Custom context menu works", () => {
		cy.visit(`/index.html#/custom-menu/willow`);
		cy.wait(1000);
		cy.shot(`initial-custom-menu`);

		cy.wxT("table-row", 12).rightclick();
		cy.wxT("menu").should("be.visible");
		cy.shot(`custom-menu-visible`);

		cy.wxT("menu-item", "add").click();
		cy.wxT("table-rows").should("have.length", 11);
		cy.shot("custom-add");

		cy.wxT("table-row", 12).rightclick();
		cy.wxT("menu-item", "copy").click();
		cy.wxT("table-rows").should("have.length", 12);
		cy.shot("custom-copy");

		cy.wxT("table-row", 19).rightclick();
		cy.wxT("menu-item", "delete").click();
		cy.wxT("table-rows").should("have.length", 11);
		cy.shot("custom-delete");

		cy.wxT("table-row", 14).rightclick();
		cy.wxT("menu-item", "info").click();
		cy.get(".wx-notice").should("be.visible");
		cy.shot("custom-info");

		cy.wxT("table-row", 15).rightclick();
		cy.wxT("menu-item", "view").click();
		cy.get(".wx-notice").should("be.visible");
		cy.shot("custom-view");
	});
});
