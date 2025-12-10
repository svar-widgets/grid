context("Fixed columns visibility", () => {
	it("Fixed left columns", () => {
		cy.visit(`/index.html#/fixed-columns/willow`);
		cy.wait(1000);
		cy.shot(`fixed-left-columns`);

		[0, 1].forEach(i => {
			cy.wxT("table-row", 1).wxT("table-cell", i).should("be.visible");
			cy.wxT("header")
				.wxT("header-row", 0)
				.find(".wx-cell")
				.eq(i)
				.should("be.visible");
		});

		cy.wxT("table").get(".wx-scroll").scrollTo("topRight");

		[0, 1].forEach(i => {
			cy.wxT("table-row", 1).wxT("table-cell", i).should("be.visible");
		});

		cy.shot(`fixed-left-columns-scrolled`);
	});

	it("Fixed right columns", () => {
		cy.visit(`/index.html#/fixed-right/willow`);
		cy.wait(1000);
		cy.shot(`fixed-right-columns`);

		cy.wxT("table-row", 11)
			.first()
			.find(".wx-fixed")
			.should("have.length", 2);
		[-2, -1].forEach(i => {
			cy.wxT("table-row", 11)
				.first()
				.wxT("table-cell", i)
				.should("be.visible")
				.should("have.class", "wx-fixed");

			cy.wxT("header")
				.wxT("header-row", 0)
				.find(".wx-cell")
				.eq(i)
				.should("be.visible");
		});

		cy.wxT("table").get(".wx-scroll").first().scrollTo("bottom");
		[-2, -1].forEach(i => {
			cy.wxT("table-row", 11)
				.first()
				.wxT("table-cell", i)
				.should("be.visible")
				.should("have.class", "wx-fixed");
		});

		cy.shot(`fixed-right-columns-scrolled`);
	});

	it("Fixed left and right columns", () => {
		cy.visit(`/index.html#/fixed-right/willow`);
		cy.viewport(1300, 975);
		cy.wait(1000);
		cy.shot(`fixed-left-right-columns`);

		cy.wxT("table-row", 11)
			.eq(1)
			.find(".wx-fixed")
			.should("have.length", 4);
		[0, 1, -2, -1].forEach(i => {
			cy.wxT("table-row", 11)
				.eq(1)
				.wxT("table-cell", i)
				.should("be.visible")
				.should("have.class", "wx-fixed");

			cy.wxT("header")
				.wxT("header-row", 1)
				.find(".wx-cell")
				.eq(i)
				.should("be.visible");
		});

		cy.wxT("table").get(".wx-scroll").eq(1).scrollTo("bottom");

		cy.wxT("table-row", 11)
			.eq(1)
			.find(".wx-fixed")
			.should("have.length", 4);
		[0, 1, -2, -1].forEach(i => {
			cy.wxT("table-row", 11)
				.eq(1)
				.wxT("table-cell", i)
				.should("be.visible")
				.should("have.class", "wx-fixed");

			cy.wxT("header")
				.wxT("header-row", 1)
				.find(".wx-cell")
				.eq(i)
				.should("be.visible");
		});

		cy.shot(`fixed-left-right-columns-scrolled`);
	});
});
