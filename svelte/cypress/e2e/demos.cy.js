const cases = [
	"/base/:skin",
	"/auto-config/:skin",
	"/spans/:skin",
	"/fillspace/:skin",
	"/columns-to-content/:skin",
	"/resize/:skin",
	"/collapsible-columns/:skin",
	"/visibility/:skin",
	"/fixed/:skin",
	"/header-vertical/:skin",
	"/size-container/:skin",
	"/size-content/:skin",
	"/styling/:skin",
	"/multiline-row/:skin",
	"/selection/:skin",
	"/multi-selection/:skin",
	"/check-selection/:skin",
	"/custom/:skin",
	"/embedding-actions/:skin",
	"/tooltips/:skin",
	"/editors/:skin",
	"/sort/:skin",
	"/pagination/:skin",
	"/context/:skin",
	"/custom-context/:skin",
	"/overlay/:skin",
	"/bigdata/:skin",
	"/dynamic/:skin",
	//"/rest/:skin",
	"/treetable/:skin",
	"/export/:skin",
	"/export-custom-styles/:skin",
	"/api/:skin",
	//"/events/:skin",
	"/scroll/:skin",
];
const skins = ["willow", "willow-dark"];

const links = [];
cases.forEach(w => {
	skins.forEach(s => {
		links.push(w.replace(":skin", s));
	});
});

context("Basic functionality", () => {
	it("widget", () => {
		links.forEach(w => {
			cy.visit(`/index.html#${w}`);
			cy.wait(500);
			cy.shot(w, { area: ".content" });
		});
	});
});
