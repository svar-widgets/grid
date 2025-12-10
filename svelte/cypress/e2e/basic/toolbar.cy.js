context("Toolbar functionality", () => {
	it("Default toolbar buttons", () => {
		cy.visit(`/index.html#/toolbar/willow`);
		cy.wait(1000);

		cy.wxT("toolbar").should("be.visible");
		cy.shot(`initial-toolbar`);

		cy.wxT("toolbar").get(".wx-tb-element").should("have.length", 3);
		cy.wxT("toolbar-button", 0).click();
		cy.wxT("toolbar")
			.get(".wx-tb-element button")
			.should("have.length", 10);
		cy.wxT("toolbar")
			.get(".wx-tb-element button[disabled]")
			.should("have.length", 3);
		cy.shot(`default-toolbar`);
	});

	it("Default toolbar functionality for single select", () => {
		cy.visit(`/index.html#/toolbar/willow`);
		cy.wait(1000);

		cy.wxT("table-rows").should("have.length", 10);

		cy.wxT("table-row", 11).click();
		cy.wxT("toolbar")
			.get(".wx-tb-element button")
			.should("have.length", 10);
		cy.wxT("toolbar")
			.get(".wx-tb-element button[disabled]")
			.should("have.length", 4);
		[5, 6, 8, 9].forEach(ind =>
			cy.wxT("toolbar-button", ind).should("be.disabled")
		);
		cy.shot(`default-disabled-toolbar-buttons`);

		cy.wxT("toolbar-button", 7).click(); // "move-item:down"
		cy.wxT("toolbar")
			.get(".wx-tb-element button[disabled]")
			.should("have.length", 2);
		cy.wxT("toolbar-button", 9).should("be.disabled");
		cy.wxT("table-rows").eq(1).should("have.attr", "data-id", "11");
		cy.shot(`default-toolbar-movedown-click`);

		cy.wxT("toolbar-button", 8).click(); // "undo"
		cy.wxT("toolbar")
			.get(".wx-tb-element button[disabled]")
			.should("have.length", 3);
		[5, 6, 8].forEach(ind =>
			cy.wxT("toolbar-button", ind).should("be.disabled")
		);
		cy.shot(`default-toolbar-undo-click`);

		cy.wxT("toolbar-button", 9).click(); // "redo"
		cy.wxT("toolbar")
			.get(".wx-tb-element button[disabled]")
			.should("have.length", 2);
		cy.wxT("toolbar-button", 9).should("be.disabled");
		cy.shot(`default-toolbar-redo-click`);

		for (let i = 0; i < 3; i++) cy.wxT("toolbar-button", 7).click(); // "move-item:down"
		cy.wxT("table-rows").eq(4).should("have.attr", "data-id", "11");

		cy.wxT("toolbar-button", 2).click(); // "delete-row"
		cy.wxT("table-rows").should("have.length", 9);
		cy.wxT("toolbar").get(".wx-tb-element button").should("have.length", 3);
		cy.shot(`default-toolbar-delete-click`);

		cy.wxT("toolbar-button", 1).click(); // "undo"
		cy.wxT("table-rows").should("have.length", 10);
		cy.wxT("toolbar")
			.get(".wx-tb-element button")
			.should("have.length", 10);
		cy.wxT("toolbar")
			.get(".wx-tb-element button[disabled]")
			.should("have.length", 1);
		cy.wxT("toolbar-button", 5).should("be.disabled");

		for (let i = 0; i < 2; i++) cy.wxT("toolbar-button", 6).click(); // "move-item:up"
		cy.wxT("table-rows").eq(2).should("have.attr", "data-id", "11");
		cy.shot(`default-toolbar-moveup-click`);

		cy.wxT("toolbar-button", 2).click(); // "delete-row"
		cy.wxT("toolbar").get(".wx-tb-element button").should("have.length", 3);

		cy.wxT("toolbar-button", 0).click(); // "add-row"
		cy.wxT("table-rows").should("have.length", 10);
		cy.wxT("table-rows").eq(9).should("have.class", "wx-selected");
		cy.shot(`default-toolbar-add-click`);

		cy.wxT("table-row", 13).wxT("table-cell", 1).click();
		cy.wxT("toolbar-button", 1).click(); // "open-editor";
		cy.wxT("table-row", 13)
			.wxT("table-cell", 1)
			.should("have.class", "wx-editor");
		cy.get("input").type("-first{enter}");
		cy.wxT("table-row", 13).wxT("table-cell", 2).click();
		cy.wxT("toolbar-button", 1).click(); // "open-editor";
		cy.wxT("table-row", 13)
			.wxT("table-cell", 2)
			.should("have.class", "wx-editor");
		cy.get("input").type("-last{enter}");
		cy.shot(`default-toolbar-editor-click`);

		cy.wxT("table-row", 15).click();
		cy.wxT("toolbar-button", 4).click(); // "cut-row"
		cy.wxT("table-row", 12).click();
		cy.wxT("toolbar-button", 5).click(); // "paste-row"
		cy.wxT("table-rows").should("have.length", 10);
		cy.wxT("table-rows").eq(1).should("have.attr", "data-id", "15");
		cy.wxT("table-row", 12).should("have.class", "wx-selected");
		cy.shot(`default-toolbar-cut-paste-click`);

		cy.wxT("toolbar-button", 3).click(); // "copy-row"
		cy.wxT("table-row", 13).click();
		cy.wxT("toolbar-button", 5).click(); // "paste-row"
		cy.wxT("table-rows").should("have.length", 11);
		cy.wxT("table-rows").eq(3).should("have.class", "wx-selected");
		cy.shot(`default-toolbar-copy-paste-click`);
	});

	it("Default toolbar functionality for multiple select", () => {
		cy.visit(`/index.html#/toolbar/willow`);
		cy.wait(1000);

		cy.wxT("table-row", 15).click();
		cy.wxT("table-row", 14).click({ ctrlKey: true });
		cy.wxT("table-row", 17).click({ ctrlKey: true });

		cy.wxT("toolbar-button", 6).click(); // "move-item:up"

		cy.wxT("table-rows").then($rows => {
			const actualOrder = Array.from($rows).map(row =>
				row.getAttribute("data-id")
			);
			const expectedOrder = [
				"11",
				"12",
				"14",
				"15",
				"13",
				"17",
				"16",
				"18",
				"19",
				"20",
			];
			expect(actualOrder).to.deep.equal(expectedOrder);
		});

		for (let i = 0; i < 2; i++) cy.wxT("toolbar-button", 6).click(); // "move-item:up"
		cy.wxT("table-rows").then($rows => {
			const actualOrder = Array.from($rows).map(row =>
				row.getAttribute("data-id")
			);
			const expectedOrder = [
				"14",
				"15",
				"11",
				"17",
				"12",
				"13",
				"16",
				"18",
				"19",
				"20",
			];
			expect(actualOrder).to.deep.equal(expectedOrder);
		});
		cy.wxT("toolbar-button", 6).should("be.disabled");
		cy.shot(`default-toolbar-multisilect-moveup-click`);

		cy.wxT("toolbar-button", 2).click(); // "delete-row"
		cy.wxT("table-rows").should("have.length", 7);
		cy.shot(`default-toolbar-multisilect-delete-click`);

		cy.wxT("table-row", 18).click();
		cy.wxT("table-row", 13).click({ ctrlKey: true });

		for (let i = 0; i < 2; i++) cy.wxT("toolbar-button", 7).click(); // "move-item:down"
		cy.wxT("table-rows").then($rows => {
			const actualOrder = Array.from($rows).map(row =>
				row.getAttribute("data-id")
			);
			const expectedOrder = ["11", "12", "16", "19", "13", "20", "18"];
			expect(actualOrder).to.deep.equal(expectedOrder);
		});
		cy.wxT("toolbar-button", 7).should("be.disabled");
		cy.shot(`default-toolbar-multisilect-movedown-click`);

		cy.wxT("toolbar-button", 0).click(); // "add-row"
		cy.wxT("table-rows").should("have.length", 9);
		cy.shot(`default-toolbar-multisilect-add-click`);

		cy.wxT("table-row", 16).click();
		cy.wxT("table-row", 13).click({ ctrlKey: true });

		cy.wxT("table-row", 12).click();
		cy.wxT("table-row", 16).wxT("table-cell", 1).click({ ctrlKey: true });
		cy.wxT("toolbar-button", 1).click(); // "open-editor";
		cy.wxT("table-row", 16)
			.wxT("table-cell", 1)
			.should("have.class", "wx-editor");
		cy.get("input").type("-first{enter}");
		cy.wxT("table-row", 19).wxT("table-cell", 2).click({ ctrlKey: true });
		cy.wxT("toolbar-button", 1).click(); // "open-editor";
		[12, 16, 19].forEach(id =>
			cy.wxT("table-row", id).should("have.class", "wx-selected")
		);
		cy.wxT("table-row", 19)
			.wxT("table-cell", 2)
			.should("have.class", "wx-editor");
		cy.get("input").type("-last{enter}");
		cy.shot(`default-toolbar-multisilect-editor-click`);
	});

	it("Default toolbar functionality for multiple select (copy-cut-paste)", () => {
		cy.visit(`/index.html#/toolbar/willow`);
		cy.wait(1000);

		cy.wxT("table-row", 14).click();
		cy.wxT("table-row", 16).click({ ctrlKey: true });

		cy.wxT("toolbar-button", 4).click(); // "cut-row"
		cy.wxT("table-row", 18).click();
		cy.wxT("toolbar-button", 5).click(); // "paste-row"

		cy.wxT("table-rows").then($rows => {
			const actualOrder = Array.from($rows).map(row =>
				row.getAttribute("data-id")
			);
			const expectedOrder = [
				"11",
				"12",
				"13",
				"15",
				"17",
				"18",
				"14",
				"16",
				"19",
				"20",
			];
			expect(actualOrder).to.deep.equal(expectedOrder);
		});
		cy.shot(`default-toolbar-multisilect-cut-paste-click`);

		cy.wxT("table-row", 19).click();
		cy.wxT("table-row", 11).click({ ctrlKey: true });

		cy.wxT("toolbar-button", 3).click(); // "copy-row"
		cy.wxT("table-row", 12).click();
		cy.wxT("toolbar-button", 5).click(); // "paste-row"
		cy.wxT("table-rows").should("have.length", 12);
		[2, 3].forEach(i =>
			cy.wxT("table-rows").eq(i).should("have.class", "wx-selected")
		);
		cy.shot(`default-toolbar-multisilect-copy-paste-click`);
	});

	it("Custom toolbar buttons", () => {
		cy.visit(`/index.html#/toolbar-custom/willow`);
		cy.wait(1000);

		cy.wxT("toolbar").should("be.visible");
		cy.wxT("toolbar").get(".wx-tb-element button").should("have.length", 4);
		cy.wxT("toolbar")
			.get(".wx-tb-element button[disabled]")
			.should("have.length", 2);
		cy.shot(`initial-toolbar-custom-buttons`);

		cy.wxT("toolbar-button", 0).click();
		cy.wxT("toolbar").get(".wx-tb-element button").should("have.length", 6);
		cy.wxT("toolbar")
			.get(".wx-tb-element button[disabled]")
			.should("have.length", 1);
		cy.shot(`toolbar-all-custom-buttons`);

		cy.wxT("toolbar-button", 2).click(); // "open-editor"
		cy.wait(500);
		cy.get(".wx-sidearea .wx-panel").should("be.visible");
		cy.shot(`toolbar-custom-external-editor`);
	});
});
