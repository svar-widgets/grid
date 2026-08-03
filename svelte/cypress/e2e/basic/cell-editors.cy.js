describe("Inline editors", () => {
	beforeEach(() => {
		cy.visit(`/index.html#/editors/willow`);
		cy.viewport(1300, 900);
	});

	function editorCell(row, column) {
		return cy.wxT("table-row", row).wxT("table-cell", column);
	}

	it(
		"can edit value in every inline editor",
		{ scrollBehavior: false },
		() => {
			editorCell(1, 1).dblclick();
			editorCell(1, 1).find("input").clear().type("Test name{enter}");
			editorCell(1, 1).should("contain.text", "Test name");
			editorCell(1, 1).should("have.focus");

			editorCell(1, 2).dblclick();
			cy.get(".wx-popup .wx-item").contains("Germany").click();
			editorCell(1, 2).should("contain.text", "Germany");
			editorCell(1, 2).should("have.focus");

			editorCell(1, 3).dblclick();
			cy.get(".wx-popup .wx-calendar button").contains("Clear").click();
			editorCell(1, 3).should("contain.text", "");
			editorCell(1, 3).should("have.focus");

			editorCell(1, 4).dblclick();
			cy.get(".wx-popup .wx-item").contains("Mary").click();
			editorCell(1, 4).should("contain.text", "Mary");
			editorCell(1, 4).should("have.focus");

			editorCell(1, 5).dblclick();
			cy.get(".wx-popup .wx-item").contains("Germany").click();
			cy.get(".wx-popup .wx-item").contains("Poland").click();
			editorCell(1, 5).click();
			editorCell(1, 5).should("contain.text", "France, USA, Germany");
			editorCell(1, 5).should("have.focus");
		}
	);

	it(
		"can close inline editor by clicking another cell (focus moved)",
		{ scrollBehavior: false },
		() => {
			for (let i = 1; i <= 5; i++) {
				editorCell(1, i).dblclick();
				editorCell(4, 0).click({ force: true });
				editorCell(4, 0).should("have.focus");
				editorCell(1, i).should("not.have.class", "wx-editor");
			}
		}
	);

	it(
		"can close datepicker, richselect and multiselect by clicking editor cell",
		{ scrollBehavior: false },
		() => {
			editorCell(1, 3).dblclick();
			editorCell(1, 3).find(".wx-value").click({ force: true });
			editorCell(1, 3).should("have.focus");
			editorCell(1, 3).should("not.have.class", "wx-editor");

			[3, 4, 5].forEach(i => {
				editorCell(1, i).dblclick();
				editorCell(1, i).find(".wx-value").click({ force: true });
				editorCell(1, i).should("have.focus");
				editorCell(1, i).should("not.have.class", "wx-editor");
			});
		}
	);
});
