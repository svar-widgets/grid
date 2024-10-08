import { describe, expect, vi, beforeEach, afterEach, test } from "vitest";
import { DataStore } from "../src/index";
import { getData, shuffle } from "./stubs/data";
import { writable } from "./stubs/writable";
import { findById, extractPropsAndFlatten } from "./stubs/helpers";

let store: DataStore;

function resetState(data?: any) {
	if (!data) data = getData();
	store = new DataStore(writable);
	store.init({ ...data });
}

beforeEach(() => {
	vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
	vi.useRealTimers();
});

describe("datastore", () => {
	describe("datastore init", () => {
		test("initializes correctly", () => {
			resetState();
			const { data } = store.getState();

			expect(store).to.not.be.undefined;
			expect(data.length).to.eq(6);
		});
	});

	test("opens and closes branches in tree mode", () => {
		resetState(getData("tree"));

		store.in.exec("close-row", { id: 1 });

		let { data, flatData } = store.getState();
		expect(findById(data, 1).open).to.eq(false);
		expect(findById(flatData, 1).open).to.eq(false);

		store.in.exec("open-row", { id: 1 });

		let state = store.getState();
		data = state.data;
		flatData = state.flatData;
		expect(findById(data, 1).open).to.eq(true);
		expect(findById(flatData, 1).open).to.eq(true);

		store.in.exec("close-row", { id: 4, nested: true });

		state = store.getState();
		data = state.data;
		flatData = state.flatData;
		expect(flatData.length).to.eq(20);
		expect(findById(data, 8).open).to.eq(false);

		store.in.exec("open-row", { id: 4 });

		state = store.getState();
		data = state.data;
		flatData = state.flatData;
		expect(flatData.length).to.eq(21);
		expect(findById(data, 8).open).to.eq(false);

		store.in.exec("open-row", { id: 5, nested: true });

		state = store.getState();
		data = state.data;
		flatData = state.flatData;
		expect(flatData.length).to.eq(25);
		expect(findById(data, 8).open).to.eq(true);

		store.in.exec("close-row", { id: 0, nested: true });

		state = store.getState();
		data = state.data;
		flatData = state.flatData;
		expect(flatData.length).to.eq(3);
		expect(findById(data, 1).open).to.eq(false);
		expect(findById(data, 2).open).to.eq(false);

		store.in.exec("open-row", { id: 5 });

		state = store.getState();
		data = state.data;
		flatData = state.flatData;
		expect(flatData.length).to.eq(3);
		expect(findById(data, 1).open).to.eq(false);
		expect(findById(data, 2).open).to.eq(false);
		expect(findById(data, 5).open).to.eq(true);

		store.in.exec("open-row", { id: 0, nested: true });
		state = store.getState();
		data = state.data;
		flatData = state.flatData;
		expect(flatData.length).to.eq(25);
		expect(findById(data, 8).open).to.eq(true);
	});

	describe("sort-rows", () => {
		test("can sort plain data in ascending order", () => {
			const d = getData();
			resetState({ ...d, data: shuffle(d.data) });

			store.in.exec("sort-rows", { key: "name", order: "asc" });

			const { data, flatData } = store.getState();

			expect(data).to.deep.eq(getData().data);

			expect(data.map(x => x.name)).to.deep.eq([
				"Item 1",
				"Item 2",
				"Item 3",
				"Item 4",
				"Item 5",
				"Item 6",
			]);

			expect(flatData.map(x => x.name)).to.deep.eq([
				"Item 1",
				"Item 2",
				"Item 3",
				"Item 4",
				"Item 5",
				"Item 6",
			]);
		});

		test("can sort plain data by multiple keys (ascending initial)", () => {
			const d = getData();
			resetState({ ...d, data: shuffle(d.data) });

			store.in.exec("sort-rows", { key: "type", order: "asc" });
			store.in.exec("sort-rows", {
				key: "name",
				order: "asc",
				add: true,
			});

			let { data, flatData } = store.getState();

			expect(data.map(x => [x.name, x.type])).to.deep.eq([
				["Item 1", "Type 1"],
				["Item 2", "Type 1"],
				["Item 3", "Type 1"],
				["Item 4", "Type 2"],
				["Item 5", "Type 2"],
				["Item 6", "Type 2"],
			]);

			expect(flatData.map(x => [x.name, x.type])).to.deep.eq([
				["Item 1", "Type 1"],
				["Item 2", "Type 1"],
				["Item 3", "Type 1"],
				["Item 4", "Type 2"],
				["Item 5", "Type 2"],
				["Item 6", "Type 2"],
			]);

			store.in.exec("sort-rows", {
				key: "name",
				order: "desc",
				add: true,
			});

			({ data, flatData } = store.getState());

			expect(data.map(x => [x.name, x.type])).to.deep.eq([
				["Item 3", "Type 1"],
				["Item 2", "Type 1"],
				["Item 1", "Type 1"],
				["Item 6", "Type 2"],
				["Item 5", "Type 2"],
				["Item 4", "Type 2"],
			]);

			expect(flatData.map(x => [x.name, x.type])).to.deep.eq([
				["Item 3", "Type 1"],
				["Item 2", "Type 1"],
				["Item 1", "Type 1"],
				["Item 6", "Type 2"],
				["Item 5", "Type 2"],
				["Item 4", "Type 2"],
			]);
		});

		test("can sort plain data in descending order", () => {
			resetState();

			store.in.exec("sort-rows", { key: "name", order: "desc" });

			const { data, flatData } = store.getState();

			expect(data.map(x => x.name)).to.deep.eq([
				"Item 6",
				"Item 5",
				"Item 4",
				"Item 3",
				"Item 2",
				"Item 1",
			]);

			expect(flatData.map(x => x.name)).to.deep.eq([
				"Item 6",
				"Item 5",
				"Item 4",
				"Item 3",
				"Item 2",
				"Item 1",
			]);
		});

		test("can sort plain data by multiple keys (descending initial)", () => {
			const d = getData();
			resetState({ ...d, data: shuffle(d.data) });

			store.in.exec("sort-rows", { key: "type", order: "desc" });
			store.in.exec("sort-rows", {
				key: "name",
				order: "asc",
				add: true,
			});

			let { data, flatData } = store.getState();

			expect(data.map(x => [x.name, x.type])).to.deep.eq([
				["Item 4", "Type 2"],
				["Item 5", "Type 2"],
				["Item 6", "Type 2"],
				["Item 1", "Type 1"],
				["Item 2", "Type 1"],
				["Item 3", "Type 1"],
			]);

			expect(flatData.map(x => [x.name, x.type])).to.deep.eq([
				["Item 4", "Type 2"],
				["Item 5", "Type 2"],
				["Item 6", "Type 2"],
				["Item 1", "Type 1"],
				["Item 2", "Type 1"],
				["Item 3", "Type 1"],
			]);

			store.in.exec("sort-rows", {
				key: "name",
				order: "desc",
				add: true,
			});

			({ data, flatData } = store.getState());

			expect(data.map(x => [x.name, x.type])).to.deep.eq([
				["Item 6", "Type 2"],
				["Item 5", "Type 2"],
				["Item 4", "Type 2"],
				["Item 3", "Type 1"],
				["Item 2", "Type 1"],
				["Item 1", "Type 1"],
			]);

			expect(flatData.map(x => [x.name, x.type])).to.deep.eq([
				["Item 6", "Type 2"],
				["Item 5", "Type 2"],
				["Item 4", "Type 2"],
				["Item 3", "Type 1"],
				["Item 2", "Type 1"],
				["Item 1", "Type 1"],
			]);
		});

		test("sorting handles empty/undefined fields", () => {
			resetState(getData("empty"));

			store.in.exec("sort-rows", { key: "name", order: "asc" });

			let { data, flatData } = store.getState();

			expect(data.map(x => x.name)).to.deep.eq([
				null,
				undefined,
				undefined,
				"",
				"Item 1",
				"Item 2",
				"Item 3",
				"Item 4",
			]);

			expect(flatData.map(x => x.name)).to.deep.eq([
				null,
				undefined,
				undefined,
				"",
				"Item 1",
				"Item 2",
				"Item 3",
				"Item 4",
			]);

			store.in.exec("sort-rows", { key: "name", order: "desc" });

			({ data, flatData } = store.getState());

			expect(data.map(x => x.name)).to.deep.eq([
				"Item 4",
				"Item 3",
				"Item 2",
				"Item 1",
				"",
				null,
				undefined,
				undefined,
			]);

			expect(flatData.map(x => x.name)).to.deep.eq([
				"Item 4",
				"Item 3",
				"Item 2",
				"Item 1",
				"",
				null,
				undefined,
				undefined,
			]);

			store.in.exec("sort-rows", { key: "type", order: "asc" });
			store.in.exec("sort-rows", {
				key: "name",
				order: "desc",
				add: true,
			});

			({ data, flatData } = store.getState());

			expect(data.map(x => [x.name, x.type])).to.deep.eq([
				["Item 1", "Type 1"],
				["", "Type 1"],
				[undefined, "Type 1"],
				["Item 3", "Type 2"],
				["Item 2", "Type 2"],
				[undefined, "Type 2"],
				["Item 4", "Type 3"],
				[null, "Type 3"],
			]);

			expect(flatData.map(x => [x.name, x.type])).to.deep.eq([
				["Item 1", "Type 1"],
				["", "Type 1"],
				[undefined, "Type 1"],
				["Item 3", "Type 2"],
				["Item 2", "Type 2"],
				[undefined, "Type 2"],
				["Item 4", "Type 3"],
				[null, "Type 3"],
			]);

			store.in.exec("sort-rows", {
				key: "name",
				order: "asc",
				add: true,
			});

			({ data, flatData } = store.getState());

			expect(data.map(x => [x.name, x.type])).to.deep.eq([
				[undefined, "Type 1"],
				["", "Type 1"],
				["Item 1", "Type 1"],
				[undefined, "Type 2"],
				["Item 2", "Type 2"],
				["Item 3", "Type 2"],
				[null, "Type 3"],
				["Item 4", "Type 3"],
			]);

			expect(flatData.map(x => [x.name, x.type])).to.deep.eq([
				[undefined, "Type 1"],
				["", "Type 1"],
				["Item 1", "Type 1"],
				[undefined, "Type 2"],
				["Item 2", "Type 2"],
				["Item 3", "Type 2"],
				[null, "Type 3"],
				["Item 4", "Type 3"],
			]);
		});

		test("can sort hierarchical data in ascending order", () => {
			const d = getData("tree");
			resetState({ ...d, data: shuffle(d.data) });

			store.in.exec("sort-rows", { key: "name", order: "asc" });

			const { data, flatData } = store.getState();

			expect(data).to.deep.eq(getData("tree").data);

			expect(extractPropsAndFlatten({ data })).to.deep.eq([
				"Parent 1",
				"Kid 1",
				"Kid 2",
				"Parent 2",
				"Kid 3",
				"Grandkid 1",
				"Grandkid 2",
				"Great-grandkid 1",
				"Great-great-grandkid 1",
				"Parent 3",
				"Kid 4",
				"Kid 5",
				"Grandkid 3",
				"Grandkid 4",
				"Great-grandkid 2",
				"Great-grandkid 3",
				"Great-great-grandkid 2",
				"Great-great-great-grandkid 1",
				"Great-great-great-grandkid 2",
				"Grandkid 5",
				"Grandkid 6",
				"Kid 6",
				"Kid 7",
				"Kid 8",
				"Kid 9",
			]);

			expect(flatData.map(x => x.name)).to.deep.eq([
				"Parent 1",
				"Kid 1",
				"Kid 2",
				"Parent 2",
				"Kid 3",
				"Grandkid 1",
				"Grandkid 2",
				"Great-grandkid 1",
				"Great-great-grandkid 1",
				"Parent 3",
				"Kid 4",
				"Kid 5",
				"Grandkid 3",
				"Grandkid 4",
				"Great-grandkid 2",
				"Great-grandkid 3",
				"Great-great-grandkid 2",
				"Great-great-great-grandkid 1",
				"Great-great-great-grandkid 2",
				"Grandkid 5",
				"Grandkid 6",
				"Kid 6",
				"Kid 7",
				"Kid 8",
				"Kid 9",
			]);
		});

		test("can sort hierarchical data by multiple keys (ascending initial)", () => {
			resetState(getData("tree_short"));

			store.in.exec("sort-rows", { key: "type", order: "asc" });
			store.in.exec("sort-rows", {
				key: "name",
				order: "asc",
				add: true,
			});

			let { data, flatData } = store.getState();

			expect(
				extractPropsAndFlatten({ data }, ["name", "type"])
			).to.deep.eq([
				["Parent 2", "Type 1"],
				["Kid 6", "Type 1"],
				["Kid 7", "Type 2"],
				["Kid 5", "Type 3"],
				["Parent 1", "Type 2"],
				["Kid 4", "Type 1"],
				["Kid 2", "Type 2"],
				["Kid 3", "Type 2"],
				["Grandkid 1", "Type 1"],
				["Grandkid 2", "Type 2"],
				["Grandkid 3", "Type 2"],
				["Kid 1", "Type 3"],
				["Parent 3", "Type 2"],
			]);

			expect(flatData.map(x => [x.name, x.type])).to.deep.eq([
				["Parent 2", "Type 1"],
				["Kid 6", "Type 1"],
				["Kid 7", "Type 2"],
				["Kid 5", "Type 3"],
				["Parent 1", "Type 2"],
				["Kid 4", "Type 1"],
				["Kid 2", "Type 2"],
				["Kid 3", "Type 2"],
				["Grandkid 1", "Type 1"],
				["Grandkid 2", "Type 2"],
				["Grandkid 3", "Type 2"],
				["Kid 1", "Type 3"],
				["Parent 3", "Type 2"],
			]);

			store.in.exec("sort-rows", {
				key: "name",
				order: "desc",
				add: true,
			});

			({ data, flatData } = store.getState());

			expect(
				extractPropsAndFlatten({ data }, ["name", "type"])
			).to.deep.eq([
				["Parent 2", "Type 1"],
				["Kid 6", "Type 1"],
				["Kid 7", "Type 2"],
				["Kid 5", "Type 3"],
				["Parent 3", "Type 2"],
				["Parent 1", "Type 2"],
				["Kid 4", "Type 1"],
				["Kid 3", "Type 2"],
				["Grandkid 1", "Type 1"],
				["Grandkid 3", "Type 2"],
				["Grandkid 2", "Type 2"],
				["Kid 2", "Type 2"],
				["Kid 1", "Type 3"],
			]);

			expect(flatData.map(x => [x.name, x.type])).to.deep.eq([
				["Parent 2", "Type 1"],
				["Kid 6", "Type 1"],
				["Kid 7", "Type 2"],
				["Kid 5", "Type 3"],
				["Parent 3", "Type 2"],
				["Parent 1", "Type 2"],
				["Kid 4", "Type 1"],
				["Kid 3", "Type 2"],
				["Grandkid 1", "Type 1"],
				["Grandkid 3", "Type 2"],
				["Grandkid 2", "Type 2"],
				["Kid 2", "Type 2"],
				["Kid 1", "Type 3"],
			]);
		});

		test("can sort hierarchical data in descending order", () => {
			resetState(getData("tree"));

			store.in.exec("sort-rows", { key: "name", order: "desc" });

			const { data, flatData } = store.getState();

			expect(extractPropsAndFlatten({ data })).to.deep.eq([
				"Parent 3",
				"Kid 9",
				"Kid 8",
				"Kid 7",
				"Kid 6",
				"Kid 5",
				"Grandkid 6",
				"Grandkid 5",
				"Grandkid 4",
				"Great-grandkid 3",
				"Great-great-grandkid 2",
				"Great-great-great-grandkid 2",
				"Great-great-great-grandkid 1",
				"Great-grandkid 2",
				"Grandkid 3",
				"Kid 4",
				"Parent 2",
				"Kid 3",
				"Grandkid 2",
				"Great-grandkid 1",
				"Great-great-grandkid 1",
				"Grandkid 1",
				"Parent 1",
				"Kid 2",
				"Kid 1",
			]);

			expect(flatData.map(x => x.name)).to.deep.eq([
				"Parent 3",
				"Kid 9",
				"Kid 8",
				"Kid 7",
				"Kid 6",
				"Kid 5",
				"Grandkid 6",
				"Grandkid 5",
				"Grandkid 4",
				"Great-grandkid 3",
				"Great-great-grandkid 2",
				"Great-great-great-grandkid 2",
				"Great-great-great-grandkid 1",
				"Great-grandkid 2",
				"Grandkid 3",
				"Kid 4",
				"Parent 2",
				"Kid 3",
				"Grandkid 2",
				"Great-grandkid 1",
				"Great-great-grandkid 1",
				"Grandkid 1",
				"Parent 1",
				"Kid 2",
				"Kid 1",
			]);
		});

		test("can sort hierarchical data by multiple keys (descending initial)", () => {
			resetState(getData("tree_short"));

			store.in.exec("sort-rows", { key: "type", order: "desc" });
			store.in.exec("sort-rows", {
				key: "name",
				order: "asc",
				add: true,
			});

			let { data, flatData } = store.getState();

			expect(
				extractPropsAndFlatten({ data }, ["name", "type"])
			).to.deep.eq([
				["Parent 1", "Type 2"],
				["Kid 1", "Type 3"],
				["Kid 2", "Type 2"],
				["Kid 3", "Type 2"],
				["Grandkid 2", "Type 2"],
				["Grandkid 3", "Type 2"],
				["Grandkid 1", "Type 1"],
				["Kid 4", "Type 1"],
				["Parent 3", "Type 2"],
				["Parent 2", "Type 1"],
				["Kid 5", "Type 3"],
				["Kid 7", "Type 2"],
				["Kid 6", "Type 1"],
			]);

			expect(flatData.map(x => [x.name, x.type])).to.deep.eq([
				["Parent 1", "Type 2"],
				["Kid 1", "Type 3"],
				["Kid 2", "Type 2"],
				["Kid 3", "Type 2"],
				["Grandkid 2", "Type 2"],
				["Grandkid 3", "Type 2"],
				["Grandkid 1", "Type 1"],
				["Kid 4", "Type 1"],
				["Parent 3", "Type 2"],
				["Parent 2", "Type 1"],
				["Kid 5", "Type 3"],
				["Kid 7", "Type 2"],
				["Kid 6", "Type 1"],
			]);

			store.in.exec("sort-rows", {
				key: "name",
				order: "desc",
				add: true,
			});

			({ data, flatData } = store.getState());

			expect(
				extractPropsAndFlatten({ data }, ["name", "type"])
			).to.deep.eq([
				["Parent 3", "Type 2"],
				["Parent 1", "Type 2"],
				["Kid 1", "Type 3"],
				["Kid 3", "Type 2"],
				["Grandkid 3", "Type 2"],
				["Grandkid 2", "Type 2"],
				["Grandkid 1", "Type 1"],
				["Kid 2", "Type 2"],
				["Kid 4", "Type 1"],
				["Parent 2", "Type 1"],
				["Kid 5", "Type 3"],
				["Kid 7", "Type 2"],
				["Kid 6", "Type 1"],
			]);

			expect(flatData.map(x => [x.name, x.type])).to.deep.eq([
				["Parent 3", "Type 2"],
				["Parent 1", "Type 2"],
				["Kid 1", "Type 3"],
				["Kid 3", "Type 2"],
				["Grandkid 3", "Type 2"],
				["Grandkid 2", "Type 2"],
				["Grandkid 1", "Type 1"],
				["Kid 2", "Type 2"],
				["Kid 4", "Type 1"],
				["Parent 2", "Type 1"],
				["Kid 5", "Type 3"],
				["Kid 7", "Type 2"],
				["Kid 6", "Type 1"],
			]);
		});
	});
});
