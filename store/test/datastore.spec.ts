/* eslint-disable vitest/valid-expect */
import { describe, expect, vi, beforeEach, afterEach, test } from "vitest";
import { DataStore, IHeaderConfig } from "../src/index";
import { getData, shuffle } from "./stubs/data";
import { writable } from "./stubs/writable";
import {
	findById,
	extractPropsAndFlatten,
	findColumnById,
} from "./stubs/helpers";

let store: DataStore;

function resetState(data?: any) {
	if (!data) data = getData();
	store = new DataStore(writable);
	store.init({
		selectedRows: [],
		...data,
	});
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
		test("can set sortMarks correctly for single key", () => {
			resetState(getData());
			const key = "name";

			store.in.exec("sort-rows", { key, order: "asc" });

			let { sortMarks } = store.getState();

			expect(sortMarks[key]).to.deep.equal({ order: "asc" });

			store.in.exec("sort-rows", { key });

			({ sortMarks } = store.getState());

			expect(sortMarks[key]).to.deep.equal({ order: "desc" });

			store.in.exec("sort-rows", { key, add: true });

			({ sortMarks } = store.getState());

			expect(sortMarks[key]).to.deep.equal({ order: "asc" });
		});

		test("can set sortMarks correctly for multiple keys", () => {
			resetState(getData());

			store.in.exec("sort-rows", { key: "name", order: "asc" });
			store.in.exec("sort-rows", {
				key: "type",
				order: "asc",
				add: true,
			});

			let { sortMarks } = store.getState();

			expect(sortMarks).to.deep.equal({
				name: { order: "asc", index: 0 },
				type: { order: "asc", index: 1 },
			});

			store.in.exec("sort-rows", { key: "name", add: true });

			({ sortMarks } = store.getState());

			expect(sortMarks).to.deep.equal({
				name: { order: "desc", index: 0 },
				type: { order: "asc", index: 1 },
			});

			store.in.exec("sort-rows", { key: "id", add: true });

			({ sortMarks } = store.getState());

			expect(sortMarks).to.deep.equal({
				name: { order: "desc", index: 0 },
				type: { order: "asc", index: 1 },
				id: { order: "asc", index: 2 },
			});
		});

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

			let filterValues;

			filters.forEach(f => {
				store.in.exec("filter-rows", f);
				({ filterValues } = store.getState());

				expect(filterValues).to.deep.eq({
					[f.key]: f.value,
				});
			});

			store.in.exec("filter-rows", { key: "type", value: "t" });
			store.in.exec("filter-rows", { key: "season", value: 3 });

			({ filterValues } = store.getState());
			expect(filterValues).to.deep.eq({
				name: "it",
				type: "t",
				season: 3,
			});

			store.in.exec("filter-rows", { key: "type", value: "" });

			({ filterValues } = store.getState());
			expect(filterValues).to.deep.eq({
				name: "it",
				type: "",
				season: 3,
			});
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

			const { filterValues } = store.getState();

			expect(filterValues).to.deep.eq({});
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

			store.in.exec("filter-rows", { key: "type", value: "3" });

			({ flatData } = store.getState());

			expect(flatData.map(x => x.name)).to.deep.eq([]);
		});

		test("can set custom filter correctly", () => {
			resetState(getData("filters"));

			const filterFunction = (obj: any) =>
				obj.name.toLowerCase().indexOf("a") !== -1;

			store.in.exec("filter-rows", { filter: filterFunction });

			const { filterValues, flatData } = store.getState();

			expect(filterValues).to.deep.eq({});
			expect(flatData.map(x => x.name)).to.deep.eq([
				"Alex",
				"Mary",
				"Kate",
			]);
		});

		test("can add row to filtered data", () => {
			resetState(getData("filters"));

			store.in.exec("filter-rows", { key: "name", value: "Al" });
			store.in.exec("add-row", {
				row: { name: "Sofia", type: "Type 2" },
			});

			let { flatData } = store.getState();

			expect(flatData.map(x => x.name)).to.deep.eq(["Alex", "Sofia"]);

			store.in.exec("filter-rows", {});

			({ flatData } = store.getState());

			expect(flatData.map(x => x.name)).to.deep.eq([
				"Alex",
				"John",
				"Bob",
				"Mary",
				"Kate",
				"",
				"Sofia",
			]);

			store.in.exec("filter-rows", { key: "type", value: "2" });
			store.in.exec("add-row", { row: { name: "Smith" }, after: 4 });

			({ flatData } = store.getState());

			expect(flatData.map(x => x.name)).to.deep.eq([
				"Mary",
				"Smith",
				"Kate",
				"",
				"Sofia",
			]);

			store.in.exec("filter-rows", {});

			({ flatData } = store.getState());

			expect(flatData.map(x => x.name)).to.deep.eq([
				"Alex",
				"John",
				"Bob",
				"Mary",
				"Smith",
				"Kate",
				"",
				"Sofia",
			]);

			store.in.exec("filter-rows", { key: "name", value: "Sam" });

			({ flatData } = store.getState());
			expect(flatData.map(x => x.name)).to.deep.eq([]);

			store.in.exec("add-row", { row: { name: "Sam" } });

			({ flatData } = store.getState());

			expect(flatData.map(x => x.name)).to.deep.eq(["Sam"]);
		});

		test("can sort filtered data", () => {
			resetState(getData("filters"));

			store.in.exec("filter-rows", { key: "name", value: "a" });
			store.in.exec("sort-rows", { key: "name", order: "asc" });

			let { flatData } = store.getState();

			expect(flatData.map(x => x.name)).to.deep.eq([
				"Alex",
				"Kate",
				"Mary",
			]);

			store.in.exec("filter-rows", {});

			({ flatData } = store.getState());

			expect(flatData.map(x => x.name)).to.deep.eq([
				"",
				"Alex",
				"Bob",
				"John",
				"Kate",
				"Mary",
			]);

			store.in.exec("filter-rows", { key: "type", value: "2" });

			({ flatData } = store.getState());

			expect(flatData.map(x => x.name)).to.deep.eq(["", "Kate", "Mary"]);
		});

		test("can delete row from filtered data", () => {
			resetState({
				...getData("filters"),
				selectedRows: [],
			});

			store.in.exec("filter-rows", { key: "name", value: "a" });
			store.in.exec("delete-row", { id: 4 });

			let { flatData } = store.getState();

			expect(flatData.map(x => x.name)).to.deep.eq(["Alex", "Kate"]);

			store.in.exec("filter-rows", {});

			({ flatData } = store.getState());

			expect(flatData.map(x => x.name)).to.deep.eq([
				"Alex",
				"John",
				"Bob",
				"Kate",
				"",
			]);
		});

		test("can update cell value in filtered data", () => {
			resetState(getData("filters"));

			store.in.exec("filter-rows", { key: "type", value: "1" });

			let { flatData } = store.getState();

			expect(flatData.length).to.eq(3);

			store.in.exec("update-cell", {
				id: 1,
				column: "type",
				value: "Type 3",
			});

			({ flatData } = store.getState());

			expect(flatData.length).to.eq(3);
			expect(flatData.map(x => x.type)).to.deep.eq([
				"Type 3",
				"Type 1",
				"Type 1",
			]);
		});

		test("can update row in filtered data", () => {
			resetState(getData("filters"));

			store.in.exec("filter-rows", { key: "name", value: "a" });

			let { flatData } = store.getState();

			expect(flatData.length).to.eq(3);

			store.in.exec("update-row", { id: 1, row: { name: "Smith" } });

			({ flatData } = store.getState());

			expect(flatData.length).to.eq(3);
			expect(flatData.map(x => x.name)).to.deep.eq([
				"Smith",
				"Mary",
				"Kate",
			]);
		});

		test("can filter tree data correctly", () => {
			resetState(getData("tree_filters"));

			let { flatData } = store.getState();
			expect(flatData.length).to.eq(14);

			store.in.exec("filter-rows", { key: "name", value: "a" });
			({ flatData } = store.getState());

			expect(flatData.map(x => x.name)).to.deep.eq([
				"Alex",
				"Adam",
				"Mary",
				"Adam",
				"Mary",
				"Sam",
			]);

			store.in.exec("filter-rows", { key: "name", value: "o" });
			({ flatData } = store.getState());

			expect(flatData.map(x => x.name)).to.deep.eq([
				"Bob",
				"John",
				"Tom",
				"Bob",
			]);

			store.in.exec("filter-rows", { key: "type", value: "2" });
			({ flatData } = store.getState());

			expect(flatData.map(x => x.name)).to.deep.eq(["John"]);

			store.in.exec("filter-rows", {});
			({ flatData } = store.getState());

			expect(flatData.length).to.eq(14);
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

	describe("undo/redo", () => {
		test("can set state history correctly", () => {
			const initData = getData();
			resetState({
				...initData,
				undo: true,
			});

			store.in.exec("add-row", { id: 7, row: {} });
			store.in.exec("hide-column", { id: "type" });

			let { history } = store.getState();

			expect(history).to.deep.eq({
				undo: 2,
				redo: 0,
			});

			store.in.exec("undo");
			({ history } = store.getState());
			expect(history).to.deep.eq({
				undo: 1,
				redo: 1,
			});

			store.in.exec("undo");
			({ history } = store.getState());
			expect(history).to.deep.eq({
				undo: 0,
				redo: 2,
			});

			store.in.exec("redo");
			({ history } = store.getState());
			expect(history).to.deep.eq({
				undo: 1,
				redo: 1,
			});

			store.in.exec("redo");
			({ history } = store.getState());
			expect(history).to.deep.eq({
				undo: 2,
				redo: 0,
			});
		});
		test("can undo/redo after adding rows", () => {
			const initData = getData();
			initData.data = initData.data.map(d => ({ ...d }));
			resetState({
				...initData,
				undo: true,
			});

			store.in.exec("add-row", { id: 7, row: {}, after: 3 });
			store.in.exec("add-row", { id: 8, row: {}, before: 1 });
			store.in.exec("add-row", { id: 9, row: {}, before: 6 });
			store.in.exec("add-row", { id: 10, row: {} });

			const testIds = [
				[8, 1, 2, 3, 7, 4, 5, 9, 6, 10],
				[8, 1, 2, 3, 7, 4, 5, 9, 6],
				[8, 1, 2, 3, 7, 4, 5, 6],
				[1, 2, 3, 7, 4, 5, 6],
				[1, 2, 3, 4, 5, 6],
			];

			let { data } = store.getState();

			for (let i = 0; i < testIds.length; i++) {
				if (!i) expect(data.map(d => d.id)).to.deep.eq(testIds[i]);
				else {
					store.in.exec("undo");
					({ data } = store.getState());
					expect(data.map(d => d.id)).to.deep.eq(testIds[i]);
				}
			}

			for (let i = testIds.length - 2; i >= 0; i--) {
				store.in.exec("redo");
				({ data } = store.getState());
				expect(data.map(d => d.id)).to.deep.eq(testIds[i]);
			}
		});
		test("can undo/redo after deleting rows", () => {
			const initData = getData();
			resetState({
				...initData,
				undo: true,
			});

			store.in.exec("delete-row", { id: 1 });
			store.in.exec("delete-row", { id: 3 });
			store.in.exec("delete-row", { id: 6 });

			const testIds = [
				[2, 4, 5],
				[2, 4, 5, 6],
				[2, 3, 4, 5, 6],
				[1, 2, 3, 4, 5, 6],
			];

			let { data } = store.getState();

			for (let i = 0; i < testIds.length; i++) {
				if (!i) expect(data.map(d => d.id)).to.deep.eq(testIds[i]);
				else {
					store.in.exec("undo");
					({ data } = store.getState());
					expect(data.map(d => d.id)).to.deep.eq(testIds[i]);
				}
			}

			for (let i = testIds.length - 2; i >= 0; i--) {
				store.in.exec("redo");
				({ data } = store.getState());
				expect(data.map(d => d.id)).to.deep.eq(testIds[i]);
			}
		});
		test("can undo/redo after updating rows", () => {
			const initData = getData();
			resetState({
				...initData,
				undo: true,
			});

			const testRows = [
				{
					id: 1,
					row: { id: 1, name: "Item 1 new", type: "Type 1 new" },
				},
				{
					id: 3,
					row: { id: 3, name: "Item 3 new", type: "Type 3 new" },
				},
				{
					id: 1,
					row: { id: 1, name: "Item 1 new new", type: "Type new" },
				},
			];

			for (let i = 0; i < testRows.length; i++) {
				store.in.exec("update-row", testRows[i]);
			}

			let { data } = store.getState();

			for (let i = testRows.length - 2; i >= 0; i--) {
				store.in.exec("undo");
				({ data } = store.getState());
				expect(findById(data, testRows[i].id)).to.deep.eq(
					testRows[i].row
				);
			}

			store.in.exec("undo");

			for (let i = 0; i < testRows.length; i++) {
				store.in.exec("redo");
				({ data } = store.getState());
				expect(findById(data, testRows[i].id)).to.deep.eq(
					testRows[i].row
				);
			}
		});
		test("can undo/redo after updating cells", () => {
			const initData = getData();
			resetState({
				...initData,
				undo: true,
			});

			const updateCells = [
				{ id: 1, column: "name", value: "Item 1 new" },
				{ id: 1, column: "name", value: "Item 1 new new" },
				{ id: 3, column: "type", value: "Type 3 new" },
				{ id: 5, column: "type", value: "Type 5 new" },
			];
			const previousCellValues: any[] = [];

			for (let i = 0; i < updateCells.length; i++) {
				const row = findById(store.getState().data, updateCells[i].id);
				previousCellValues.push(row[updateCells[i].column]);
				store.in.exec("update-cell", updateCells[i]);
			}

			let { data } = store.getState();

			for (let i = updateCells.length - 1; i >= 0; i--) {
				store.in.exec("undo");
				({ data } = store.getState());
				const row = findById(data, updateCells[i].id);
				expect(row[updateCells[i].column]).to.deep.eq(
					previousCellValues[i]
				);
			}

			for (let i = 0; i < updateCells.length; i++) {
				store.in.exec("redo");
				({ data } = store.getState());
				const row = findById(data, updateCells[i].id);
				expect(row[updateCells[i].column]).to.deep.eq(
					updateCells[i].value
				);
			}
		});
		test("can undo/redo after showing/hiding columns", () => {
			const initData = getData();
			resetState({
				...initData,
				undo: true,
			});

			store.in.exec("hide-column", { id: "name" });
			store.in.exec("hide-column", { id: "type" });
			let { columns } = store.getState();
			expect(columns.filter(c => c.hidden).length).to.eq(2);

			store.in.exec("undo");
			({ columns } = store.getState());
			expect(findColumnById(columns, "type")?.hidden).to.eq(false);

			store.in.exec("undo");
			({ columns } = store.getState());
			expect(findColumnById(columns, "name")?.hidden).to.eq(false);

			store.in.exec("redo");
			({ columns } = store.getState());
			expect(findColumnById(columns, "name")?.hidden).to.eq(true);
			expect(findColumnById(columns, "type")?.hidden).to.eq(false);
		});
		test("can undo/redo after collapsing/expanding columns", () => {
			const initData = getData();
			initData.columns.forEach(
				c => (c.header = { text: c.header, collapsible: true } as any)
			);
			resetState({
				...initData,
				undo: true,
			});

			store.in.exec("collapse-column", { id: "name" });
			store.in.exec("collapse-column", { id: "type" });
			let { columns } = store.getState();
			expect(
				columns.filter(c => (c.header as IHeaderConfig)?.collapsed)
					.length
			).to.eq(2);

			store.in.exec("undo");
			({ columns } = store.getState());
			expect(
				(findColumnById(columns, "type")?.header as IHeaderConfig)
					?.collapsed
			).to.eq(false);
			expect(
				(findColumnById(columns, "name")?.header as IHeaderConfig)
					?.collapsed
			).to.eq(true);

			store.in.exec("undo");
			({ columns } = store.getState());
			expect(
				(findColumnById(columns, "name")?.header as IHeaderConfig)
					?.collapsed
			).to.eq(false);

			store.in.exec("redo");
			({ columns } = store.getState());
			expect(
				(findColumnById(columns, "name")?.header as IHeaderConfig)
					?.collapsed
			).to.eq(true);
			expect(
				(findColumnById(columns, "type")?.header as IHeaderConfig)
					?.collapsed
			).to.eq(false);
		});
		test("can undo/redo after resizing the column", () => {
			const initData = getData();
			resetState({
				...initData,
				undo: true,
			});

			store.in.exec("resize-column", { id: "name", width: 220 });
			store.in.exec("resize-column", { id: "name", width: 500 });

			store.in.exec("undo");
			let { columns } = store.getState();
			expect(findColumnById(columns, "name")?.width).to.eq(220);

			store.in.exec("redo");
			({ columns } = store.getState());
			expect(findColumnById(columns, "name")?.width).to.eq(500);

			store.in.exec("resize-column", { id: "name", width: 350 });
			store.in.exec("undo");
			store.in.exec("undo");
			({ columns } = store.getState());
			expect(findColumnById(columns, "name")?.width).to.eq(220);

			store.in.exec("redo");
			store.in.exec("redo");
			({ columns } = store.getState());
			expect(findColumnById(columns, "name")?.width).to.eq(350);
		});
		test("can undo/redo after resizing the column with 'inProgress' property", () => {
			const initData = getData();
			resetState({
				...initData,
				undo: true,
			});

			for (let i = 1; i < 11; i++) {
				store.in.exec("resize-column", {
					id: "name",
					width: 160 + i,
					inProgress: true,
				});
			}
			store.in.exec("resize-column", {
				id: "name",
				width: 170,
				inProgress: false,
			});

			let { columns } = store.getState();

			({ columns } = store.getState());
			expect(findColumnById(columns, "name")?.width).to.eq(170);

			store.in.exec("undo");
			({ columns } = store.getState());
			expect(findColumnById(columns, "name")?.width).to.eq(160);

			store.in.exec("redo");
			({ columns } = store.getState());
			expect(findColumnById(columns, "name")?.width).to.eq(170);
		});
		test("can undo/redo after opening/closing branches in tree mode", () => {
			const initData = getData("tree");
			resetState({
				...initData,
				undo: true,
			});

			const ids = [1, 4, 14];

			ids.forEach(id => store.in.exec("close-row", { id }));

			store.in.exec("undo");
			let { flatData } = store.getState();
			expect(
				flatData.filter(d => ids.includes(d.id)).map(d => d.open)
			).to.deep.eq([false, false, true]);

			store.in.exec("undo");
			({ flatData } = store.getState());
			expect(
				flatData.filter(d => ids.includes(d.id)).map(d => d.open)
			).to.deep.eq([false, true, true]);

			store.in.exec("redo");
			({ flatData } = store.getState());
			expect(
				flatData.filter(d => ids.includes(d.id)).map(d => d.open)
			).to.deep.eq([false, false, true]);

			store.in.exec("redo");
			({ flatData } = store.getState());
			expect(
				flatData.filter(d => ids.includes(d.id)).map(d => d.open)
			).to.deep.eq([false, false, false]);
		});
		test("can undo/redo after combinations of different actions", () => {
			const initData = getData();
			resetState({
				...initData,
				undo: true,
			});

			store.in.exec("add-row", { id: 7, row: {}, after: 3 });
			store.in.exec("hide-column", { id: "type" });
			store.in.exec("delete-row", { id: 1 });
			store.in.exec("update-cell", {
				id: 6,
				column: "name",
				value: "Item 6 new",
			});

			let { data, columns } = store.getState();

			store.in.exec("undo");
			({ data, columns } = store.getState());
			expect(findById(data, 6).name).to.eq("Item 6");
			expect(data.map(d => d.id)).to.deep.eq([2, 3, 7, 4, 5, 6]);
			expect(findColumnById(columns, "type")?.hidden).to.eq(true);

			store.in.exec("undo");
			({ data, columns } = store.getState());
			expect(data.map(d => d.id)).to.deep.eq([1, 2, 3, 7, 4, 5, 6]);
			expect(findColumnById(columns, "type")?.hidden).to.eq(true);

			store.in.exec("redo");
			({ data, columns } = store.getState());
			expect(data.map(d => d.id)).to.deep.eq([2, 3, 7, 4, 5, 6]);
			expect(findColumnById(columns, "type")?.hidden).to.eq(true);

			store.in.exec("undo");
			store.in.exec("undo");
			({ columns } = store.getState());
			expect(findColumnById(columns, "type")?.hidden).to.eq(false);

			store.in.exec("undo");
			({ data } = store.getState());
			expect(data.map(d => d.id)).to.deep.eq([1, 2, 3, 4, 5, 6]);

			store.in.exec("redo");
			store.in.exec("redo");
			({ data, columns } = store.getState());
			expect(data.map(d => d.id)).to.deep.eq([1, 2, 3, 7, 4, 5, 6]);
			expect(findColumnById(columns, "type")?.hidden).to.eq(true);

			store.in.exec("add-row", { id: 8, row: {} });
			store.in.exec("redo");
			({ data } = store.getState());
			expect(data.length).to.eq(8);

			store.in.exec("undo");
			({ data } = store.getState());
			expect(data.length).to.eq(7);
		});
		test("can undo/redo after moving items", () => {
			const initData = getData();
			resetState({
				...initData,
				undo: true,
			});

			store.in.exec("move-item", { id: 2, target: 5 });
			store.in.exec("move-item", { id: 6, target: 5, mode: "before" });
			store.in.exec("move-item", { id: 3, target: 1, mode: "before" });
			store.in.exec("move-item", { id: 4, target: 6 });

			const testIds = [
				[3, 1, 6, 4, 5, 2],
				[3, 1, 4, 6, 5, 2],
				[1, 3, 4, 6, 5, 2],
				[1, 3, 4, 5, 2, 6],
				[1, 2, 3, 4, 5, 6],
			];

			let { data } = store.getState();

			for (let i = 1; i < testIds.length; i++) {
				store.in.exec("undo");
				({ data } = store.getState());
				expect(data.map(d => d.id)).to.deep.eq(testIds[i]);
			}

			for (let i = testIds.length - 2; i >= 0; i--) {
				store.in.exec("redo");
				({ data } = store.getState());
				expect(data.map(d => d.id)).to.deep.eq(testIds[i]);
			}

			store.in.exec("undo");
			({ data } = store.getState());
			expect(data.map(d => d.id)).to.deep.eq(testIds[1]);
		});
		test("can undo/redo after moving items with 'inProgress' property", () => {
			const initData = getData();
			resetState({
				...initData,
				undo: true,
			});

			for (let i = 1; i < 5; i++) {
				store.in.exec("move-item", {
					id: 1,
					target: i + 1,
					inProgress: true,
				});
			}
			store.in.exec("move-item", { id: 1, target: 5, inProgress: false });

			store.in.exec("move-item", {
				id: 6,
				target: 1,
				mode: "before",
				inProgress: true,
			});
			store.in.exec("move-item", {
				id: 6,
				target: 5,
				mode: "before",
				inProgress: true,
			});
			store.in.exec("move-item", {
				id: 6,
				target: 4,
				mode: "before",
				inProgress: true,
			});
			store.in.exec("move-item", {
				id: 6,
				target: 4,
				mode: "before",
				inProgress: false,
			});

			let { data } = store.getState();

			const testIds = [
				[2, 3, 6, 4, 5, 1],
				[2, 3, 4, 5, 1, 6],
				[1, 2, 3, 4, 5, 6],
			];

			for (let i = 1; i < testIds.length; i++) {
				store.in.exec("undo");
				({ data } = store.getState());
				expect(data.map(d => d.id)).to.deep.eq(testIds[i]);
			}

			for (let i = testIds.length - 2; i >= 0; i--) {
				store.in.exec("redo");
				({ data } = store.getState());
				expect(data.map(d => d.id)).to.deep.eq(testIds[i]);
			}
		});
		test("can undo/redo after moving items in tree mode", () => {
			const initData = getData("tree_short");
			resetState({
				...initData,
				undo: true,
			});

			store.in.exec("move-item", { id: 2, target: 6 });
			store.in.exec("move-item", { id: 7, target: 3, mode: "before" });
			store.in.exec("move-item", { id: 8, target: 9 });
			store.in.exec("move-item", { id: 13, target: 12, mode: "before" });

			const testIds = [
				[1, 7, 3, 4, 5, 6, 2, 9, 8, 10, 11, 13, 12],
				[1, 7, 3, 4, 5, 6, 2, 9, 8, 10, 11, 12, 13],
				[1, 7, 3, 4, 5, 6, 2, 8, 9, 10, 11, 12, 13],
				[1, 3, 4, 5, 6, 2, 7, 8, 9, 10, 11, 12, 13],
				[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
			];

			let { flatData } = store.getState();

			for (let i = 1; i < testIds.length; i++) {
				store.in.exec("undo");
				({ flatData } = store.getState());
				expect(flatData.map(d => d.id)).to.deep.eq(testIds[i]);
			}

			for (let i = testIds.length - 2; i >= 0; i--) {
				store.in.exec("redo");
				({ flatData } = store.getState());
				expect(flatData.map(d => d.id)).to.deep.eq(testIds[i]);
			}

			store.in.exec("undo");
			({ flatData } = store.getState());
			expect(flatData.map(d => d.id)).to.deep.eq(testIds[1]);
		});
	});
});
