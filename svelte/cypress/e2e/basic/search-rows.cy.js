describe("Search rows functionality", () => {
	it("should perform text search across all columns", () => {
		cy.visit("/index.html#/search-rows/willow");
		cy.wait(100);

		cy.get(".wx-text input").type("er");

		cy.wxT("table-row", 1).find(".wx-search").should("have.length", 1);
		cy.wxT("table-row", 2).find(".wx-search").should("have.length", 5);
		cy.wxT("table-row", 6).find(".wx-search").should("have.length", 0);
		cy.shot(`search-rows-all-columns`);

		cy.get(".wx-text input").type("n");
		cy.wxT("table").find(".wx-search").should("have.length", 1);

		cy.get(".wx-text .wxi-close").click();

		cy.wxT("table").find(".wx-search").should("have.length", 0);
		cy.shot(`search-rows-all-columns-clear`);

		cy.get(".wx-text input")
			.invoke("attr", "spellcheck", "false")
			.type("abc");
		cy.wxT("table").find(".wx-search").should("have.length", 0);
		cy.shot(`search-rows-all-columns-no-result`);
	});

	it("should perform text search across specific columns", () => {
		cy.visit("/index.html#/search-rows/willow");
		cy.wait(100);

		cy.get(".wx-text input").type("ne");

		cy.get(".wx-checkboxgroup .wx-item").eq(1).click();

		cy.wxT("table").find(".wx-search").should("have.length", 2);
		cy.shot(`search-rows-column-firstName`);

		cy.get(".wx-checkboxgroup .wx-item").eq(2).click();
		cy.wxT("table").find(".wx-search").should("have.length", 4);
		cy.shot(`search-rows-columns-first-lastName`);

		cy.get(".wx-checkboxgroup .wx-item").eq(1).click();
		cy.wxT("table").find(".wx-search").should("have.length", 2);
		cy.shot(`search-rows-column-lastName`);

		cy.get(".wx-text .wxi-close").click();

		cy.wxT("table").find(".wx-search").should("have.length", 0);
		cy.shot(`search-rows-column-lastName-clear`);

		cy.get(".wx-checkboxgroup .wx-item").eq(4).click();
		cy.get(".wx-text input").type("  uSa ");

		cy.wxT("table").find(".wx-search").should("have.length", 1);
		cy.shot(`search-rows-column-country`);

		cy.get(".wx-text input").type("abc");
		cy.wxT("table").find(".wx-search").should("have.length", 0);
		cy.shot(`search-rows-column-country-no-result`);
	});

	it("should navigate to specific search result row", () => {
		cy.visit("/index.html#/search-rows/willow");
		cy.wait(100);

		cy.get(".wx-text input").type("mi");
		cy.get(".search .navigation span").should(
			"have.text",
			"0/8 (rows matches)"
		);
		cy.get(".search .navigation button").eq(0).should("be.disabled");
		cy.get(".search .navigation button").eq(1).should("not.be.disabled");
		cy.shot(`search-rows-navigate-result`);

		const rows = [2, 8, 9, 11, 14, 15, 16, 20];

		rows.forEach(id => {
			cy.get(".search .navigation button").eq(1).click();
			cy.wxT("table-row", id)
				.should("be.visible")
				.should("have.class", "search-highlight");
			cy.get(".search-highlight").should("have.length", 1);
		});

		cy.get(".search .navigation button").eq(0).should("not.be.disabled");
		cy.get(".search .navigation button").eq(1).should("be.disabled");
		cy.get(".search .navigation span").should(
			"have.text",
			"8/8 (rows matches)"
		);
		cy.shot(`search-rows-navigate-result-row-last`);

		for (let i = rows.length - 2; i >= 0; i--) {
			cy.get(".search .navigation button").eq(0).click();
			cy.wxT("table-row", rows[i])
				.should("be.visible")
				.should("have.class", "search-highlight");
			cy.get(".search-highlight").should("have.length", 1);
		}
		cy.get(".search .navigation span").should(
			"have.text",
			"1/8 (rows matches)"
		);
		cy.get(".search .navigation button").eq(1).should("not.be.disabled");
		cy.get(".search .navigation button").eq(1).should("not.be.disabled");
		cy.shot(`search-rows-navigate-result-row-first`);

		cy.get(".search .navigation button").eq(0).click();
		cy.get(".search .navigation span").should(
			"have.text",
			"0/8 (rows matches)"
		);
		cy.get(".search .navigation button").eq(0).should("be.disabled");
		cy.get(".search .navigation button").eq(1).should("not.be.disabled");
		cy.get(".search-highlight").should("have.length", 0);
		cy.shot(`search-rows-navigate-result-row-clear`);
	});
});
