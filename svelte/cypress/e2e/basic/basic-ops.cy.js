context("Basic functionality", () => {
	it("main views", () => {
		cy.visit(`/index.html#/local-data/willow`);
		cy.wait(1000);
		cy.shot(`initial`);
	});
});
