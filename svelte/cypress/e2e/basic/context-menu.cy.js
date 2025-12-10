context("Context menu functionality", () => {
	it("Default context menu works", () => {
		cy.visit(`/index.html#/context-menu/willow`);
		cy.wait(1000);
		cy.shot(`initial-menu`);

		cy.wxT("table-row", 13).rightclick();
		cy.wxT("menu").should("be.visible");
		cy.shot(`context-menu-visible`);

		cy.wxT("menu-item", "move-item:up").click();
		cy.wxT("table-row", 13).rightclick();
		cy.wxT("menu-item", "move-item:up").click();

		cy.wxT("table-rows").then($rows => {
			const actualOrder = Array.from($rows).map(row =>
				row.getAttribute("data-id")
			);
			const expectedOrder = [
				"13",
				"11",
				"12",
				"14",
				"15",
				"16",
				"17",
				"18",
				"19",
				"20",
			];
			expect(actualOrder).to.deep.equal(expectedOrder);
		});
		cy.shot(`context-menu-move-up`);

		cy.wxT("table-row", 13).rightclick();
		cy.wxT("menu-item", "move-item:up").should("have.class", "wx-disabled");

		cy.wxT("table-row", 17).click();
		for (let i = 0; i < 3; i++) {
			cy.wxT("table-row", 17).rightclick();
			cy.wxT("menu-item", "move-item:down").click();
		}

		cy.wxT("table-rows").then($rows => {
			const actualOrder = Array.from($rows).map(row =>
				row.getAttribute("data-id")
			);
			const expectedOrder = [
				"13",
				"11",
				"12",
				"14",
				"15",
				"16",
				"18",
				"19",
				"20",
				"17",
			];
			expect(actualOrder).to.deep.equal(expectedOrder);
		});
		cy.shot(`context-menu-move-down`);

		cy.wxT("table-row", 17).rightclick();
		cy.wxT("menu-item", "move-item:down").should(
			"have.class",
			"wx-disabled"
		);

		cy.wxT("menu-item", "add-row:before").click();
		cy.wxT("table-rows").should("have.length", 11);
		cy.shot("context-add-before");

		cy.wxT("table-row", 12).rightclick();
		cy.wxT("menu-item", "add-row:after").click();
		cy.wxT("table-rows").should("have.length", 12);
		cy.shot("context-add-after");

		cy.wxT("table-row", 12).rightclick();
		cy.wxT("menu-item", "paste-row").should("have.class", "wx-disabled");
		cy.wxT("menu-item", "copy-row").click();
		cy.wxT("table-row", 15).rightclick();
		cy.wxT("menu-item", "paste-row").click();
		cy.wxT("table-rows").should("have.length", 13);
		cy.wxT("table-rows").eq(6).should("have.class", "wx-selected");
		cy.shot("context-copy-paste");

		cy.wxT("table-row", 11).rightclick();
		cy.wxT("menu-item", "cut-row").click();
		cy.wxT("table-row", 19).rightclick();
		cy.wxT("menu-item", "paste-row").click();
		cy.wxT("table-rows").should("have.length", 13);
		cy.wxT("table-row", 19).should("have.class", "wx-selected");
		cy.shot("context-cut-paste");

		cy.wxT("table-row", 19).rightclick();
		cy.wxT("menu-item", "delete-row").click();
		cy.wxT("table-rows").should("have.length", 12);
		cy.shot("context-delete");
	});

	it("Default context menu works with multiple select", () => {
		cy.visit(`/index.html#/context-menu/willow`);
		cy.wait(1000);
		cy.shot(`initial-menu`);

		cy.wxT("table-row", 15).click();
		cy.wxT("table-row", 13).click({ ctrlKey: true });
		cy.wxT("table-row", 17).click({ ctrlKey: true });
		cy.shot(`context-menu-multiple-visible`);

		for (let i = 0; i < 2; i++) {
			cy.wxT("table-row", 17).rightclick();
			cy.wxT("table-rows")
				.filter(".wx-selected")
				.should("have.length", 3);
			cy.wxT("menu").should("be.visible");
			cy.wxT("menu-item", "move-item:up").click();
		}

		cy.wxT("table-rows").then($rows => {
			const actualOrder = Array.from($rows).map(row =>
				row.getAttribute("data-id")
			);
			const expectedOrder = [
				"13",
				"11",
				"15",
				"12",
				"17",
				"14",
				"16",
				"18",
				"19",
				"20",
			];
			expect(actualOrder).to.deep.equal(expectedOrder);
		});
		cy.shot(`context-menu-move-up-multiple`);

		cy.wxT("table-row", 17).rightclick();
		cy.wxT("menu-item", "move-item:up").should("have.class", "wx-disabled");

		cy.wxT("table-row", 18).click();
		cy.wxT("table-row", 19).click({ ctrlKey: true });
		cy.wxT("table-row", 19).rightclick();
		cy.wxT("menu-item", "move-item:down").click();

		cy.wxT("table-rows").then($rows => {
			const actualOrder = Array.from($rows).map(row =>
				row.getAttribute("data-id")
			);
			const expectedOrder = [
				"13",
				"11",
				"15",
				"12",
				"17",
				"14",
				"16",
				"20",
				"18",
				"19",
			];
			expect(actualOrder).to.deep.equal(expectedOrder);
		});
		cy.shot(`context-menu-move-down-multiple`);

		cy.wxT("table-row", 18).rightclick();
		cy.wxT("menu-item", "move-item:down").should(
			"have.class",
			"wx-disabled"
		);

		cy.wxT("table-row", 12).click();
		cy.wxT("table-row", 16).click({ ctrlKey: true });
		cy.wxT("table-row", 16).rightclick();
		cy.wxT("menu-item", "add-row:before").click();
		cy.wxT("table-rows").should("have.length", 12);
		cy.shot(`context-menu-add-before-multiple`);

		cy.wxT("table-row", 12).click();
		cy.wxT("table-row", 16).click({ ctrlKey: true });
		cy.wxT("table-row", 16).rightclick();
		cy.wxT("menu-item", "add-row:after").click();
		cy.wxT("table-rows").should("have.length", 14);
		cy.shot(`context-menu-add-after-multiple`);

		cy.wxT("table-row", 12).click();
		cy.wxT("table-row", 17).click({ ctrlKey: true });
		cy.wxT("table-row", 18).click({ ctrlKey: true });
		cy.wxT("table-row", 17).rightclick();
		cy.wxT("menu-item", "delete-row").click();
		cy.wxT("table-rows").should("have.length", 11);
		cy.shot(`context-menu-delete-multiple`);
	});

	it("Default context menu works with multiple select (copy-cut-past)", () => {
		cy.visit(`/index.html#/context-menu/willow`);
		cy.wait(1000);
		cy.shot(`initial-menu`);

		cy.wxT("table-row", 15).click();
		cy.wxT("table-row", 13).click({ ctrlKey: true });
		cy.wxT("table-row", 17).click({ ctrlKey: true });

		cy.wxT("table-row", 17).rightclick();
		cy.wxT("menu-item", "paste-row").should("have.class", "wx-disabled");
		cy.wxT("menu-item", "cut-row").click();
		cy.wxT("table-row", 19).rightclick();
		cy.wxT("menu-item", "paste-row").click();

		cy.wxT("table-rows").then($rows => {
			const actualOrder = Array.from($rows).map(row =>
				row.getAttribute("data-id")
			);
			const expectedOrder = [
				"11",
				"12",
				"14",
				"16",
				"18",
				"19",
				"13",
				"15",
				"17",
				"20",
			];
			expect(actualOrder).to.deep.equal(expectedOrder);
		});

		cy.wxT("table-row", 19).should("have.class", "wx-selected");
		cy.shot(`context-menu-cut-paste-multiple`);

		cy.wxT("table-row", 12).click();
		cy.wxT("table-row", 18).click({ ctrlKey: true });

		cy.wxT("table-row", 18).rightclick();
		cy.wxT("menu-item", "copy-row").click();
		cy.wxT("table-row", 11).rightclick();
		cy.wxT("menu-item", "paste-row").click();

		cy.wxT("table-rows").should("have.length", 12);
		[1, 2].forEach(i =>
			cy.wxT("table-rows").eq(i).should("have.class", "wx-selected")
		);
		cy.shot(`context-menu-copy-paste-multiple`);

		cy.wxT("table-row", 18).click();
		cy.wxT("table-row", 16).click({ ctrlKey: true });

		cy.wxT("table-row", 16).rightclick();
		cy.wxT("menu-item", "copy-row").click();
		cy.wxT("table-row", 12).rightclick();
		cy.wxT("table-row", 19).click({ ctrlKey: true });
		cy.wxT("table-row", 12).rightclick();
		cy.wxT("menu-item", "paste-row").click();

		cy.wxT("table-rows").should("have.length", 16);
		[4, 5, 10, 11].forEach(i =>
			cy.wxT("table-rows").eq(i).should("have.class", "wx-selected")
		);
		cy.shot(`context-menu-copy-paste-multiple-2`);
	});

	it("Context menu with custom options works", () => {
		cy.visit(`/index.html#/menu-options/willow`);
		cy.wait(1000);
		cy.shot(`menu-options`);

		cy.wxT("table-row", 12).rightclick();
		cy.wxT("menu-item", "add-row:after").click();
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
		cy.wxT("menu-item", "duplicate").click();
		cy.wxT("table-rows").should("have.length", 12);
		cy.shot("custom-duplicate");

		cy.wxT("table-row", 19).rightclick();
		cy.wxT("menu-item", "delete").click();
		cy.wxT("table-rows").should("have.length", 11);
		cy.shot("custom-delete");

		cy.wxT("table-row", 14).rightclick();
		cy.wxT("menu-item", "info").click();
		cy.get(".wx-notice").should("be.visible");
		cy.get(".wx-notice .wxi-close").click();
		cy.shot("custom-info");

		cy.wxT("table-row", 15).rightclick();
		cy.wxT("menu-item", "view").click();
		cy.get(".wx-notice").should("be.visible");
		cy.get(".wx-notice .wxi-close").click();
		cy.shot("custom-view");
	});
});
