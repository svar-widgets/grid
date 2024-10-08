describe("Keyboard navigation works", () => {
	it("rows are selected by arrows", { scrollBehavior: false }, () => {
		cy.visit(`/index.html#/inline-editors/willow`);

		cy.wxT("table-row", 11).click({ force: true });
		cy.wxT("table").trigger("keydown", { code: "arrowDown" });
		cy.wxT("table-row", 12).should("have.class", "wx-selected");

		for (let i = 0; i < 3; i++)
			cy.wxT("table").trigger("keydown", { code: "arrowDown" });
		cy.wxT("table-row", 15).should("have.class", "wx-selected");

		cy.wxT("table").trigger("keydown", { code: "arrowUp" });
		cy.wxT("table-row", 14).should("have.class", "wx-selected");

		for (let i = 0; i < 3; i++)
			cy.wxT("table").trigger("keydown", { code: "arrowUp" });
		cy.wxT("table-row", 11).should("have.class", "wx-selected");
	});

	it("editors are opened and navigated", { scrollBehavior: false }, () => {
		cy.visit(`/index.html#/inline-editors/willow`);

		cy.wxT("table-row", 11).click({ force: true });
		for (let i = 0; i < 3; i++)
			cy.wxT("table").trigger("keydown", { code: "arrowDown" });
		cy.wxT("table-row", 14).should("have.class", "wx-selected");

		cy.wxT("table-row", 14).wxT("table-cell", 1).dblclick();
		cy.get("input").type("Gotham");
		for (let i = 0; i < 3; i++)
			cy.wxT("table").trigger("keydown", { code: "Tab" });
		cy.wxT("table-row", 14).find("input").type("aaaa@dom.com");

		cy.shot("table-editing-key-nav");

		for (let i = 0; i < 10; i++)
			cy.wxT("table").trigger("keydown", { code: "Tab" });

		cy.wait(500);
		cy.wxT("table-row", 15)
			.wxT("table-cell", 1)
			.find("input")
			.clear()
			.type("Star City");

		cy.wxT("table").trigger("keydown", { code: "Shift+Tab" });
		cy.wxT("table-row", 14).find("input").type("aaaa@dom.com");

		cy.shot("table-editing-key-nav-tabs-right");

		for (let i = 0; i < 12; i++)
			cy.wxT("table").trigger("keydown", { code: "Shift+Tab" });

		cy.wxT("table-row", 14)
			.wxT("table-cell", 0)
			.find("input")
			.clear()
			.type("Also Star City");
		cy.wxT("table-row", 14)
			.find("input")
			.trigger("keydown", { code: "Enter", key: "Enter" });
		cy.get("input").should("not.exist");
		cy.shot("table-editing-key-nav-tabs-left");
	});

	it("rows are selected by arrows", { scrollBehavior: false }, () => {
		cy.visit(`/index.html#/vertical-headers/willow`);

		let first = cy.wxT("table").first();
		first.click();
		for (let i = 0; i < 5; i++)
			first.trigger("keydown", { code: "arrowDown" });
		first.wxT("table-row", 7).should("have.class", "wx-selected");
		first.wxT("table-row", 7).should("be.visible");

		cy.shot("table-vertical-heads-key-nav-down");

		first = cy.wxT("table").first();
		for (let i = 0; i < 4; i++)
			first.trigger("keydown", { code: "arrowUp" });
		first.wxT("table-row", 3).should("have.class", "wx-selected");
		first.wxT("table-row", 3).should("be.visible");

		cy.shot("table-vertical-heads-key-nav-up");

		const second = cy.wxT("table").eq(1);
		second.click();
		for (let i = 0; i < 15; i++)
			second.trigger("keydown", { code: "arrowDown" });
		for (let i = 0; i < 7; i++)
			second.trigger("keydown", { code: "arrowUp" });
		second.wxT("table-row", 8).should("have.class", "wx-selected");
		second.wxT("table-row", 8).should("be.visible");

		cy.shot("table-vertical-heads-key-nav-down-up");
	});

	it(
		"editors are opened correctly when columns are frozen",
		{ scrollBehavior: false },
		() => {
			cy.visit(`/index.html#/fixed-columns/willow`);

			cy.wxT("table-row", 3).click();
			cy.wxT("table-row", 3).wxT("table-cell", 1).dblclick();
			for (let i = 0; i < 8; i++)
				cy.wxT("table").trigger("keydown", { code: "Tab" });
			cy.wxT("table-row", 4).find("input").type(" Ciara");
			for (let i = 0; i < 2; i++)
				cy.wxT("table").trigger("keydown", { code: "Shift+Tab" });
			cy.wxT("table-row", 3).find("input").clear().type("Today!");

			cy.shot("table-fixed-columns-tab-editor");

			cy.wxT("table-row", 3)
				.find("input")
				.trigger("keydown", { code: "Enter", key: "Enter" });
			for (let i = 0; i < 16; i++)
				cy.wxT("table").trigger("keydown", { code: "arrowDown" });
			cy.wxT("table-row", 19).wxT("table-cell", 1).dblclick();
			for (let i = 0; i < 6; i++)
				cy.wxT("table").trigger("keydown", { code: "Tab" });
			cy.wxT("table-row", 19).find("input").clear();
			cy.wxT("table").trigger("keydown", { code: "Escape" });
			cy.wxT("table-row", 19)
				.wxT("table-cell", 5)
				.invoke("text")
				.then(text => text.trim())
				.should("not.equal", "");
		}
	);
});
