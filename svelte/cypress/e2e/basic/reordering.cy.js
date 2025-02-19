describe(
	"Reordering rows",
	{
		scrollBehavior: false,
	},
	() => {
		const reorderRows = (
			from,
			to,
			targetCell = 1,
			position = "center",
			reverse
		) => {
			cy.wxT("table-rows").then($rows => {
				const rows = Array.from($rows);
				const order = reverse
					? rows.slice(from, to).reverse()
					: rows.slice(from, to);

				order.forEach($row => {
					cy.wrap($row)
						.wxT("table-cell", targetCell)
						.drag("move", position)
						.wait(20);
				});
			});
		};

		const verifyOrder = expectedOrder => {
			cy.wxT("table-rows").then($rows => {
				const actualOrder = Array.from($rows).map(row =>
					row.getAttribute("data-id")
				);
				expect(
					actualOrder.slice(0, actualOrder.length)
				).to.contain.deep.ordered.members(expectedOrder);
			});
		};

		it("basic reordering", () => {
			cy.visit("/index.html#/reordering-basic/willow");
			cy.wait(1000);
			cy.shot("reordering-basic-initial");

			// drag down, insert above
			cy.wxT("table-row", 2).wxT("table-cell", 1).drag("start");
			reorderRows(0, 5, 1, "top");
			cy.wxT("table-row", 7).wxT("table-cell", 1).drag("end", "top");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["1", "3", "4", "5", "2", "6", "7", "8", "9"]);

			cy.shot("reordering-basic-drag-down-insert-above-target");

			// drag down, insert below
			cy.wxT("table-row", 1).wxT("table-cell", 1).drag("start");
			reorderRows(0, 7, 1, "bottom");
			cy.wxT("table-row", 7).wxT("table-cell", 1).drag("end", "bottom");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["3", "4", "5", "2", "6", "7", "1", "8", "9"]);

			cy.shot("reordering-basic-drag-down-insert-below-target");

			// drag up, insert below
			cy.wxT("table-row", 9).wxT("table-cell", 1).drag("start");
			reorderRows(3, 9, 1, "bottom", true);
			cy.wxT("table-row", 5).wxT("table-cell", 1).drag("end", "bottom");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["3", "4", "5", "9", "2", "6", "7", "1", "8"]);

			cy.shot("reordering-basic-drag-up-insert-below-target");

			// drag up, insert above
			cy.wxT("table-row", 8).wxT("table-cell", 1).drag("start");
			reorderRows(0, 12, 1, "top", true);
			cy.wxT("table-row", 3).wxT("table-cell", 1).drag("end", "top");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["8", "3", "4", "5", "9", "2", "6", "7", "1"]);

			cy.shot("reordering-basic-result");
		});

		it("basic reordering, drag handlers", () => {
			cy.visit("/index.html#/reordering-handlers/willow");
			cy.wait(1000);
			cy.shot("reordering-drag-handle-initial");

			// drag down, insert above
			cy.wxT("table-row", 3).wxT("row-drag-handle").drag("start");
			reorderRows(3, 8, 0, "top");
			cy.wxT("table-row", 9).wxT("table-cell", 0).drag("end", "top");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["1", "2", "4", "5", "6", "7", "8", "3", "9"]);

			cy.shot("reordering-drag-handle-drag-down-insert-above-target");

			// drag down, insert below
			cy.wxT("table-row", 1).wxT("row-drag-handle").drag("start");
			reorderRows(0, 5, 0, "bottom");
			cy.wxT("table-row", 6).wxT("table-cell", 0).drag("end", "bottom");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["2", "4", "5", "6", "1", "7", "8", "3", "9"]);

			cy.shot("reordering-drag-handle-drag-down-insert-below-target");

			// drag up, insert below
			cy.wxT("table-row", 9).wxT("row-drag-handle").drag("start");
			reorderRows(3, 9, 0, "bottom", true);
			cy.wxT("table-row", 5).wxT("table-cell", 0).drag("end", "bottom");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["2", "4", "5", "9", "6", "1", "7", "8", "3"]);

			cy.shot("reordering-drag-handle-drag-up-insert-below-target");

			// drag up, insert above
			cy.wxT("table-row", 7).wxT("row-drag-handle").drag("start");
			reorderRows(0, 10, 0, "top", true);
			cy.wxT("table-row", 2).wxT("table-cell", 0).drag("end", "top");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["7", "2", "4", "5", "9", "6", "1", "8", "3"]);

			cy.shot("reordering-drag-handle-result");
		});

		it("should not be able to reorder rows when starting drag outside designated handle", () => {
			cy.visit("/index.html#/reordering-handlers/willow");
			cy.wait(1000);
			cy.shot("reordering-wrong-target-initial");

			cy.wxT("table-row", 1).wxT("table-cell", 0).drag("start", "right");
			reorderRows(0, 8, 0, "top");
			cy.wxT("table-row", 9).wxT("table-cell", 0).drag("end", "top");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);

			cy.shot("reordering-wrong-target-result");
		});

		it("should not be able to reorder rows without a drag handle", () => {
			cy.visit("/index.html#/reordering-handlers/willow");
			cy.wait(1000);
			cy.shot("reordering-non-draggable-item-initial");

			cy.wxT("table-row", 2).wxT("row-drag-handle").should("not.exist");
			cy.wxT("table-row", 2).wxT("table-cell", 0).drag("start");
			reorderRows(0, 8, 0, "top");
			cy.wxT("table-row", 9).wxT("table-cell", 0).drag("end", "top");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);

			cy.shot("reordering-non-draggable-item-result");
		});
	}
);
