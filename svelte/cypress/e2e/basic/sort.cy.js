describe("Sorting rows", () => {
	const ascendingCities = [
		"Caleven",
		"Darrenport",
		"Eulaliabury",
		"Eulaliabury",
		"Eulaliabury",
		"Eulaliabury",
		"Herzogmouth",
		"Janiyahaven",
		"West Meda",
		"West Meda",
	];

	it("can sort rows by single column", () => {
		cy.visit("/index.html#/sort/willow");
		cy.wait(100);

		cy.wxT("header").wxT("header-row", 0).find(".wx-cell").eq(1).click();
		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(1)
			.find("i")
			.should("be.visible")
			.should("have.class", "wxi-arrow-up");

		// ascending
		ascendingCities.forEach((v, i) => {
			cy.wxT("table-rows")
				.eq(i)
				.wxT("table-cell", 1)
				.should("contain", v);
		});

		cy.shot("grid-sort-ascending");

		cy.wxT("header").wxT("header-row", 0).find(".wx-cell").eq(1).click();
		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(1)
			.find("i")
			.should("be.visible")
			.should("have.class", "wxi-arrow-down");

		// descending
		[...ascendingCities].reverse().forEach((v, i) => {
			cy.wxT("table-rows")
				.eq(i)
				.wxT("table-cell", 1)
				.should("contain", v);
		});

		cy.shot("grid-sort-descending");

		cy.wxT("header").wxT("header-row", 0).find(".wx-cell").eq(0).click();
		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(0)
			.find("i")
			.should("be.visible")
			.should("have.class", "wxi-arrow-up");
		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(1)
			.find("i")
			.should("not.exist");

		const rowStart = 11;

		for (let i = 0; i < 10; i++)
			cy.wxT("table-rows")
				.eq(i)
				.wxT("table-cell", 0)
				.should("contain", `${rowStart + i}`);
	});

	it("can sort rows by multiple column", () => {
		cy.visit("/index.html#/sort/willow");
		cy.wait(100);

		cy.wxT("header").wxT("header-row", 0).find(".wx-cell").eq(1).click();
		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(1)
			.find("i")
			.should("be.visible")
			.should("have.class", "wxi-arrow-up");

		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(0)
			.click({ ctrlKey: true });
		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(0)
			.find("i")
			.should("be.visible")
			.should("have.class", "wxi-arrow-up");
		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(1)
			.find("i")
			.should("be.visible")
			.should("have.class", "wxi-arrow-up");
		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(0)
			.find(".wx-order")
			.should("be.visible")
			.should("contain", "2");
		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(1)
			.find(".wx-order")
			.should("be.visible")
			.should("contain", "1");

		// ascending
		["11", "19", "13", "15", "16", "17", "12", "20", "14", "18"].forEach(
			(v, i) => {
				cy.wxT("table-rows")
					.eq(i)
					.wxT("table-cell", 0)
					.should("contain", v);
			}
		);

		cy.shot("grid-sort-multisort-ascending");

		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(0)
			.click({ ctrlKey: true });
		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(0)
			.find("i")
			.should("be.visible")
			.should("have.class", "wxi-arrow-down");
		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(1)
			.find("i")
			.should("be.visible")
			.should("have.class", "wxi-arrow-up");

		// first descending, second ascending
		["11", "19", "17", "16", "15", "13", "12", "20", "18", "14"].forEach(
			(v, i) => {
				cy.wxT("table-rows")
					.eq(i)
					.wxT("table-cell", 0)
					.should("contain", v);
			}
		);

		cy.shot("grid-sort-multisort-asc-desc");

		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(1)
			.click({ ctrlKey: true });
		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(0)
			.find("i")
			.should("be.visible")
			.should("have.class", "wxi-arrow-down");
		cy.wxT("header")
			.wxT("header-row", 0)
			.find(".wx-cell")
			.eq(1)
			.find("i")
			.should("be.visible")
			.should("have.class", "wxi-arrow-down");

		// descending
		[...ascendingCities].reverse().forEach((v, i) => {
			cy.wxT("table-rows")
				.eq(i)
				.wxT("table-cell", 1)
				.should("contain", v);
		});

		cy.shot("grid-sort-multisort-descending");
	});
});
