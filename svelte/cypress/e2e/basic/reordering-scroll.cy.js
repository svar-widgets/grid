describe(
	"Reordering rows and scrolling",
	{
		scrollBehavior: false,
	},
	() => {
		beforeEach(() => {
			cy.visit("/index.html#/reordering-basic/willow");
			cy.wait(1000);
		});

		const getNearestSafeValue = value => Math.round(value / 100) * 100;

		const syncScrollState = (type = "scrollTop", dir = 1) => {
			// scroll state might not be the exact same after dragscroll
			// sync scroll state to avoid flakiness
			cy.wxT("table")
				.wxT("table-scroll")
				.then($el => {
					const scroll = $el[0][type];
					const roundedValue = getNearestSafeValue(scroll);

					dir === 1
						? expect(roundedValue).to.not.eq(0)
						: expect(roundedValue).to.eq(0);

					cy.wrap($el)
						.scrollTo(
							type === "scrollLeft" ? roundedValue : 0,
							type === "scrollTop" ? roundedValue : 0
						)
						.wait(50);
				});
		};

		const isOrderedSubset = (array, subset) => {
			return subset.every((val, ind) => {
				const pos = array.indexOf(val);
				if (ind === 0) return pos !== -1;
				return pos > array.indexOf(subset[ind - 1]);
			});
		};

		const verifyOrder = (expectedOrder, fromStart = true) => {
			cy.wxT("table-rows").then($rows => {
				const actualOrder = Array.from($rows).map(row =>
					row.getAttribute("data-id")
				);
				if (fromStart) {
					expect(
						actualOrder.slice(0, actualOrder.length)
					).to.contain.deep.ordered.members(expectedOrder);
				} else {
					expect(isOrderedSubset(actualOrder, expectedOrder)).to.be
						.true;
				}
			});
		};

		it("should scroll the component down while dragging the row and finish drag after (regular scroll)", () => {
			cy.shot("reordering-scroll-down-initial");

			cy.wxT("table-row", 2).wxT("table-cell", 1).drag("start");
			cy.wxT("table").wxT("table-scroll").scrollTo(0, 700).wait(50);
			cy.wxT("table-row", 25)
				.wxT("table-cell", 1)
				.drag("move")
				.wait(20)
				.drag("end");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(
				["20", "21", "22", "23", "24", "2", "25", "26", "27"],
				false
			);

			cy.shot("reordering-scroll-down-result");
		});

		it("should scroll the component up while dragging the row and finish drag after (regular scroll)", () => {
			cy.shot("reordering-scroll-up-initial");

			cy.wxT("table").wxT("table-scroll").scrollTo(0, 700).wait(50);
			cy.wxT("table-row", 25).wxT("table-cell", 1).drag("start");
			cy.wxT("table").wxT("table-scroll").scrollTo(0, 0).wait(50);
			cy.wxT("table-row", 1)
				.wxT("table-cell", 1)
				.drag("move")
				.wait(20)
				.drag("end");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["25", "1", "2", "3", "4", "5", "6", "7", "8"]);

			cy.shot("reordering-scroll-up-result");
		});

		it("should scroll the component right while dragging the row and finish drag after (regular scroll)", () => {
			cy.shot("reordering-scroll-right-initial");

			cy.wxT("table-row", 2).wxT("table-cell", 1).drag("start");
			cy.wxT("table").wxT("table-scroll").scrollTo(700, 0).wait(50);
			cy.wxT("table-row", 7)
				.wxT("table-cell", 5)
				.drag("move")
				.wait(20)
				.drag("end");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["1", "3", "4", "5", "6", "2", "7", "8", "9"]);

			cy.wxT("table")
				.wxT("table-scroll")
				.scrollTo(0, 0)
				.then(() => {
					cy.shot("reordering-scroll-right-result");
				});
		});

		it("should scroll the component left while dragging the row and finish drag after (regular scroll)", () => {
			cy.shot("reordering-scroll-left-initial");

			cy.wxT("table").wxT("table-scroll").scrollTo(700, 0).wait(50);
			cy.wxT("table-row", 2).wxT("table-cell", 5).drag("start");
			cy.wxT("table").wxT("table-scroll").scrollTo(0, 0).wait(50);
			cy.wxT("table-row", 7)
				.wxT("table-cell", 1)
				.drag("move")
				.wait(20)
				.drag("end");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["1", "3", "4", "5", "6", "2", "7", "8", "9"]);

			cy.shot("reordering-scroll-left-result");
		});

		it("should scroll the component down while dragging the row and finish drag after (dragscroll)", () => {
			cy.shot("reordering-dragscroll-down-initial");

			cy.wxT("table-row", 2).wxT("table-cell", 1).drag("start");

			cy.wxT("table").then($table => {
				const box = $table[0].getBoundingClientRect();

				cy.wrap($table).drag("move", "bottom", { clientY: box.bottom });
				cy.wait(1000);
				cy.wrap($table).drag("move", "bottom", {
					clientY: box.bottom - 40,
				});

				syncScrollState("scrollTop", 1);
			});

			cy.wxT("table-row", 25)
				.wxT("table-cell", 1)
				.drag("move")
				.wait(20)
				.drag("end");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(
				["20", "21", "22", "23", "24", "25", "2", "26", "27"],
				false
			);

			cy.shot("reordering-dragscroll-down-result");
		});

		it("should scroll the component up while dragging the row and be able to finish drag after (dragscroll)", () => {
			cy.shot("reordering-dragscroll-up-initial");

			cy.wxT("table").wxT("table-scroll").scrollTo(0, 700).wait(50);
			cy.wxT("table-row", 25).wxT("table-cell", 1).drag("start");

			cy.wxT("table").then($table => {
				const box = $table[0].getBoundingClientRect();

				cy.wrap($table).drag("move", "top", { clientY: box.top });
				cy.wait(1000);
				cy.wrap($table).drag("move", "top", { clientY: box.top + 40 });

				syncScrollState("scrollTop", -1);
			});

			cy.wxT("table-row", 1)
				.wxT("table-cell", 1)
				.drag("move")
				.wait(20)
				.drag("end");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["25", "1", "2", "3", "4", "5", "6", "7", "8"]);

			cy.shot("reordering-dragscroll-up-result");
		});

		it("should scroll the component right while dragging the row and be able to finish drag after (dragscroll)", () => {
			cy.shot("reordering-dragscroll-right-initial");

			cy.wxT("table-row", 2).wxT("table-cell", 1).drag("start");

			cy.wxT("table").then($table => {
				const box = $table[0].getBoundingClientRect();

				cy.wrap($table).drag("move", "right", { clientX: box.right });
				cy.wait(1000);
				cy.wrap($table).drag("move", "right", {
					clientX: box.right - 40,
				});
				syncScrollState("scrollLeft");
			});

			cy.wxT("table-row", 7)
				.wxT("table-cell", 5)
				.drag("move")
				.wait(20)
				.drag("end");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["1", "3", "4", "5", "6", "2", "7", "8", "9"]);

			cy.wxT("table")
				.wxT("table-scroll")
				.scrollTo(0, 0)
				.then(() => {
					cy.shot("reordering-dragscroll-right-result");
				});
		});

		it("should scroll the component left while dragging the row and be able to finish drag after (dragscroll)", () => {
			cy.shot("reordering-dragscroll-left-initial");

			cy.wxT("table").wxT("table-scroll").scrollTo(700, 0).wait(50);

			cy.wxT("table-row", 2)
				.wxT("table-cell", 5)
				.trigger("mousedown", { button: 0 });

			cy.wxT("table").then($table => {
				const box = $table[0].getBoundingClientRect();

				cy.wrap($table).drag("move", "left", { clientX: box.left });
				cy.wait(1000);
				cy.wrap($table).drag("move", "left", {
					clientX: box.left + 40,
				});
				syncScrollState("scrollLeft", -1);
			});

			cy.wxT("table-row", 7)
				.wxT("table-cell", 1)
				.drag("move")
				.wait(20)
				.drag("end");
			cy.wxT("drag-zone").should("not.exist");

			verifyOrder(["1", "3", "4", "5", "6", "2", "7", "8", "9"]);

			cy.shot("reordering-dragscroll-left-result");
		});
	}
);
