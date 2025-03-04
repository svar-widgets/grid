/* eslint-disable vitest/valid-expect */
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

			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
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

	describe("filter-rows", () => {
		test("can set filterValues correctly", () => {
			resetState(getData("filters"));

			const filters = [
				{ key: "name", value: "i" },
				{ key: "name", value: "it" },
				{ key: "name", value: "ite" },
				{ key: "name", value: "it" },
			];

			let filterValues, filter;

			filters.forEach(f => {
				store.in.exec("filter-rows", f);
				({ filterValues, filter } = store.getState());

				expect(filterValues).to.deep.eq({
					[f.key]: f.value,
				});
				expect(typeof filter).to.eq("function");
			});

			store.in.exec("filter-rows", { key: "type", value: "t" });
			store.in.exec("filter-rows", { key: "season", value: 3 });

			({ filterValues, filter } = store.getState());
			expect(filterValues).to.deep.eq({
				name: "it",
				type: "t",
				season: 3,
			});

			store.in.exec("filter-rows", { key: "type", value: "" });

			({ filterValues, filter } = store.getState());
			expect(filterValues).to.deep.eq({
				name: "it",
				type: "",
				season: 3,
			});

			expect(typeof filter).to.eq("function");
		});

		test("can reset filterValues correctly", () => {
			resetState(getData("filters"));

			const filters = [
				{ key: "name", value: "it" },
				{ key: "type", value: "y" },
				{ key: "season", value: 2 },
			];

			filters.forEach(f => {
				store.in.exec("filter-rows", f);
			});

			store.in.exec("filter-rows", {});

			const { filterValues, filter } = store.getState();

			expect(filterValues).to.deep.eq({});
			expect(filter).to.eq(null);
		});

		test("can filter data correctly", () => {
			resetState(getData("filters"));

			store.in.exec("filter-rows", { key: "name", value: "a" });
			let { flatData } = store.getState();

			expect(flatData.map(x => x.name)).to.deep.eq([
				"Alex",
				"Mary",
				"Kate",
			]);

			store.in.exec("filter-rows", { key: "type", value: "2" });

			({ flatData } = store.getState());

			expect(flatData.map(x => x.name)).to.deep.eq(["Mary", "Kate"]);

			store.in.exec("filter-rows", { key: "season", value: 4 });

			({ flatData } = store.getState());

			expect(flatData.map(x => x.name)).to.deep.eq(["Mary"]);

			store.in.exec("filter-rows", { key: "name", value: "" });
			store.in.exec("filter-rows", { key: "season", value: "" });

			({ flatData } = store.getState());

			expect(flatData.map(x => x.name)).to.deep.eq(["Mary", "Kate", ""]);
		});

		test("can set filter correctly", () => {
			resetState(getData("filters"));

			const filterFunction = (obj: any) =>
				obj.name.toLowerCase().indexOf("a") !== -1;

			store.in.exec("filter-rows", { filter: filterFunction });

			const { filterValues, filter, flatData } = store.getState();

			expect(filterValues).to.deep.eq({});
			expect(filter).to.deep.eq(filterFunction);
			expect(flatData.map(x => x.name)).to.deep.eq([
				"Alex",
				"Mary",
				"Kate",
			]);
		});
	});

	describe("move-item", () => {
		test("should move item before target", () => {
			resetState();

			store.in.exec("move-item", { id: 3, target: 2, mode: "before" });

			const { data } = store.getState();

			expect(store.getRowIndex(3)).to.eq(1);
			expect(data.map(x => x.id)).to.deep.eq([1, 3, 2, 4, 5, 6]);
		});

		test("should move item after target", () => {
			resetState();

			store.in.exec("move-item", { id: 2, target: 4, mode: "after" });

			const { data } = store.getState();

			expect(store.getRowIndex(2)).to.eq(3);
			expect(data.map(x => x.id)).to.deep.eq([1, 3, 4, 2, 5, 6]);
		});

		test("should move item to the start", () => {
			resetState();

			store.in.exec("move-item", { id: 5, target: 1, mode: "before" });

			const { data } = store.getState();

			expect(store.getRowIndex(5)).to.eq(0);
			expect(data.map(x => x.id)).to.deep.eq([5, 1, 2, 3, 4, 6]);
		});

		test("should move item to the end", () => {
			resetState();

			store.in.exec("move-item", { id: 2, target: 6, mode: "after" });

			const { data } = store.getState();

			expect(store.getRowIndex(2)).to.eq(5);
			expect(data.map(x => x.id)).to.deep.eq([1, 3, 4, 5, 6, 2]);
		});

		test("should move item between the boundaries", () => {
			resetState();

			store.in.exec("move-item", { id: 4, target: 1, mode: "before" });

			let { data } = store.getState();

			expect(store.getRowIndex(4)).to.eq(0);
			expect(data.map(x => x.id)).to.deep.eq([4, 1, 2, 3, 5, 6]);

			store.in.exec("move-item", { id: 4, target: 6, mode: "after" });

			({ data } = store.getState());

			expect(store.getRowIndex(4)).to.eq(5);
			expect(data.map(x => x.id)).to.deep.eq([1, 2, 3, 5, 6, 4]);
		});

		test("should not perform move with a wrong ID specified", () => {
			resetState();

			store.in.exec("move-item", {
				id: "someId",
				target: 4,
				mode: "before",
			});

			const { data } = store.getState();

			expect(data.map(x => x.id)).to.deep.eq([1, 2, 3, 4, 5, 6]);
		});

		test("should not perform move with a wrong target specified", () => {
			resetState();

			store.in.exec("move-item", {
				id: 4,
				target: "someId",
				mode: "before",
			});

			const { data } = store.getState();

			expect(data.map(x => x.id)).to.deep.eq([1, 2, 3, 4, 5, 6]);
		});
	});
});
