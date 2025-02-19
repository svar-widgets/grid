describe("Keyboard navigation works", () => {
	it("rows are selected by arrows", { scrollBehavior: false }, () => {
		cy.visit(`/index.html#/inline-editors/willow`);

		cy.wxT("table-row", 11).wxT("table-cell", 1).click({ force: true });
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

	it(
		"rows are selected by arrows with filtered data",
		{ scrollBehavior: false },
		() => {
			cy.visit(`/index.html#/filters/willow`);

			cy.wxT("table")
				.first()
				.within(() => {
					cy.get(".wx-header input").first().type("m");
					cy.wxT("table-row", 3)
						.wxT("table-cell", 1)
						.click({ force: true });
					[7, 8, 14, 16].forEach(id => {
						cy.root().trigger("keydown", { code: "arrowDown" });
						cy.shot(`richselect`);
						cy.wxT("table-row", id).should(
							"have.class",
							"wx-selected"
						);
					});

					cy.get(".wx-header input").first().clear();

					cy.get(".wx-header .wx-richselect").click();
					cy.get(".wx-header .wx-dropdown .wx-item").eq(2).click();
					cy.wxT("table-rows").should("have.length", 1);
					cy.wxT("table-row", 3)
						.wxT("table-cell", 1)
						.click({ force: true });
					cy.root().trigger("keydown", { code: "arrowDown" });
					cy.wxT("table-row", 3).should("have.class", "wx-selected");
					cy.root().trigger("keydown", { code: "arrowUp" });
					cy.wxT("table-row", 3).should("have.class", "wx-selected");

					cy.get(".wx-header .wx-richselect").click();
					cy.get(".wx-header .wx-dropdown .wx-item").eq(1).click();
					cy.get(".wx-header input").first().type("m");

					cy.wxT("table-row", 7)
						.wxT("table-cell", 1)
						.click({ force: true });
					[8, 14, 16].forEach(id => {
						cy.root().trigger("keydown", { code: "arrowDown" });
						cy.wxT("table-row", id).should(
							"have.class",
							"wx-selected"
						);
					});
				});
		}
	);

	it("cell are focused by arrows", { scrollBehavior: false }, () => {
		cy.visit(`/index.html#/inline-editors/willow`);

		cy.wxT("table-row", 11).wxT("table-cell", 0).click({ force: true });
		cy.wxT("table-row", 11).wxT("table-cell", 0).should("have.focus");

		for (let i = 0; i < 3; i++)
			cy.wxT("table").trigger("keydown", { code: "arrowRight" });
		cy.wxT("table-row", 11).wxT("table-cell", 3).should("have.focus");

		for (let i = 0; i < 3; i++)
			cy.wxT("table").trigger("keydown", { code: "arrowDown" });
		cy.wxT("table-row", 14).wxT("table-cell", 3).should("have.focus");

		for (let i = 0; i < 2; i++)
			cy.wxT("table").trigger("keydown", { code: "arrowLeft" });
		cy.wxT("table-row", 14).wxT("table-cell", 1).should("have.focus");

		for (let i = 0; i < 2; i++)
			cy.wxT("table").trigger("keydown", { code: "arrowUp" });
		cy.wxT("table-row", 12).wxT("table-cell", 1).should("have.focus");
	});

	it("editors are opened and closed", { scrollBehavior: false }, () => {
		cy.visit(`/index.html#/inline-editors/willow`);

		cy.wxT("table-row", 11).wxT("table-cell", 1).click({ force: true });
		cy.wxT("table-row", 11).wxT("table-cell", 1).should("have.focus");

		cy.wxT("table").trigger("keydown", { code: "f2" });
		cy.get("input").type("-city{enter}");

		cy.wxT("table-row", 11).wxT("table-cell", 1).should("have.focus");

		for (let i = 0; i < 3; i++)
			cy.wxT("table").trigger("keydown", { code: "arrowDown" });
		cy.wxT("table").trigger("keydown", { code: "f2" });
		cy.get("input").type("Gotham{enter}");

		cy.wxT("table-row", 14).wxT("table-cell", 1).should("have.focus");

		cy.shot("table-editors-open-close-key-nav");
	});

	it("editors are opened and navigated", { scrollBehavior: false }, () => {
		cy.visit(`/index.html#/inline-editors/willow`);

		cy.wxT("table-row", 11).wxT("table-cell", 1).click({ force: true });
		for (let i = 0; i < 3; i++)
			cy.wxT("table").trigger("keydown", { code: "arrowDown" });
		cy.wxT("table-row", 14).should("have.class", "wx-selected");
		cy.wxT("table-row", 14).wxT("table-cell", 1).should("have.focus");

		cy.wxT("table-row", 11).wxT("table-cell", 1).dblclick();
		cy.get("input").type("Gotham");
		for (let i = 0; i < 3; i++)
			cy.wxT("table").trigger("keydown", { code: "Tab" });
		cy.wxT("table-row", 11).find("input").type("London");

		cy.shot("table-editing-key-nav-tabs-right");

		for (let i = 0; i < 3; i++)
			cy.wxT("table").trigger("keydown", { code: "Shift+Tab" });

		cy.wxT("table-row", 11)
			.wxT("table-cell", 1)
			.find("input")
			.clear()
			.type("Also Star City");
		cy.wxT("table-row", 11)
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

			cy.wxT("table-row", 3).wxT("table-cell", 1).click();
			cy.wxT("table-row", 3)
				.wxT("table-cell", 1)
				.trigger("keydown", { code: "f2" });
			for (let i = 0; i < 8; i++)
				cy.wxT("table").trigger("keydown", { code: "Tab" });
			cy.wxT("table-row", 4).find("input").type(" Ciara");
			for (let i = 0; i < 2; i++)
				cy.wxT("table").trigger("keydown", { code: "Shift+Tab" });
			cy.wxT("table-row", 3).find("input").clear().type("Today!");

			cy.shot("table-fixed-columns-tab-editor");

			cy.wxT("table-row", 3).find("input").type("{enter}");
			for (let i = 0; i < 16; i++)
				cy.wxT("table").trigger("keydown", { code: "arrowDown" });
			for (let i = 0; i < 6; i++)
				cy.wxT("table").trigger("keydown", { code: "arrowLeft" });
			cy.wxT("table-row", 19)
				.wxT("table-cell", 1)
				.should("have.focus")
				.trigger("keydown", { code: "f2" });
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

	it(
		"the first or the last cell can be focused",
		{ scrollBehavior: false },
		() => {
			cy.visit(`/index.html#/header-vertical-text/willow`);

			cy.wxT("table-row", 11).wxT("table-cell", 0).click({ force: true });
			cy.wxT("table-row", 11).wxT("table-cell", 0).should("have.focus");

			for (let i = 0; i < 4; i++)
				cy.wxT("table").trigger("keydown", { code: "arrowRight" });

			cy.wxT("table-row", 11).wxT("table-cell", 4).should("have.focus");
			cy.wxT("table").trigger("keydown", { code: "home" });
			cy.wxT("table-row", 11).wxT("table-cell", 0).should("have.focus");

			cy.shot("table-first-focused-cell-in-the-row");

			cy.wxT("table-row", 14).wxT("table-cell", 2).click({ force: true });
			cy.wxT("table").trigger("keydown", { code: "end" });
			cy.wxT("table-row", 14).wxT("table-cell", 5).should("have.focus");

			cy.shot("table-last-focused-cell-in-the-row");
		}
	);

	it("the row in tree mode is opened or closed", () => {
		cy.visit(`/index.html#/tree-mode/willow`);

		cy.wxT("table-row", 1).wxT("table-cell", 0).click({ force: true });
		cy.wxT("table").trigger("keydown", { code: "arrowRight" });
		cy.wxT("table-row", 1).wxT("table-cell", 1).should("have.focus");
		cy.wxT("table").trigger("keydown", { code: "enter" });
		cy.wxT("table").trigger("keydown", { code: "arrowDown" });
		cy.wxT("table-row", 2).wxT("table-cell", 1).should("have.focus");
		cy.wxT("table").trigger("keydown", { code: "enter" });
		cy.shot("table-tree-rows-are-closed");

		cy.wxT("table").trigger("keydown", { code: "enter" });
		cy.wxT("table").trigger("keydown", { code: "arrowUp" });
		cy.wxT("table").trigger("keydown", { code: "enter" });
		cy.shot("table-tree-row-is-opened");
	});

	it("focus works when selection is disabled", () => {
		cy.visit(`/index.html#/check-selection/willow`);

		let first = cy.wxT("table").first();

		first.wxT("table-row", 11).wxT("table-cell", 0).click({ force: true });
		for (let i = 0; i < 3; i++)
			first.trigger("keydown", { code: "arrowDown" });
		first.trigger("keydown", { code: "arrowRight" });

		first.wxT("table-row", 14).wxT("table-cell", 1).should("have.focus");
		first.wxT("table-row", 14).should("not.have.class", "wx-selected");

		cy.shot("table-cell-focused-not-selected-key");

		first = cy.wxT("table").first();
		first.click();
		first.wxT("table-row", 11).wxT("table-cell", 0).click({ force: true });
		first.wxT("table-row", 11).wxT("table-cell", 0).should("have.focus");
		first.wxT("table-row", 11).should("not.have.class", "wx-selected");

		cy.shot("table-cell-focused-not-selected-click");

		first.wxT("table-row", 11).get(".wx-checkbox label").eq(0).click();
		first.wxT("table-row", 12).get(".wx-checkbox label").eq(1).click();
		first.wxT("table-row", 11).should("have.class", "wx-selected");
		first.wxT("table-row", 12).should("have.class", "wx-selected");

		first.wxT("table-row", 11).wxT("table-cell", 1).click({ force: true });
		first.wxT("table-row", 11).wxT("table-cell", 1).should("have.focus");
		for (let i = 0; i < 3; i++)
			first.trigger("keydown", { code: "arrowDown" });

		first.wxT("table-row", 14).wxT("table-cell", 1).should("have.focus");
		first.wxT("table-row", 11).should("have.class", "wx-selected");
		first.wxT("table-row", 12).should("have.class", "wx-selected");

		cy.shot("table-cell-focused-not-selected-checkbox");
	});
});
