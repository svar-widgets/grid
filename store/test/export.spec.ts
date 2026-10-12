import { describe, expect, test } from "vitest";
import { getRenderValue } from "../src/export";
import type { IColumn, IRow } from "../src/types";

function cell(row: IRow, col: IColumn) {
	return getRenderValue(row, col);
}

describe("getRenderValue", () => {
	test("plain object", () => {
		expect(
			cell(
				{ v: { type: "snet", date: new Date(2026, 3, 2) } },
				{ id: "v" }
			)
		).toBe("");
	});

	test("null-prototype object", () => {
		const value = Object.create(null);
		value.type = "snet";
		expect(cell({ v: value }, { id: "v" })).toBe("");
	});

	test("Date", () => {
		const date = new Date(2026, 3, 2);
		expect(cell({ v: date }, { id: "v" })).toBe(date + "");
	});

	test("array", () => {
		expect(cell({ v: [1, "a"] }, { id: "v" })).toBe("1,a");
		expect(
			cell({ v: [{ type: "snet" }, { type: "mso" }] }, { id: "v" })
		).toBe("[object Object],[object Object]");
	});

	test("Number and String wrappers", () => {
		expect(cell({ v: Object(12) }, { id: "v" })).toBe("12");
		expect(cell({ v: Object("snet") }, { id: "v" })).toBe("snet");
	});

	test("class instance with own toString", () => {
		class Money {
			toString() {
				return "12.50";
			}
		}
		expect(cell({ v: new Money() }, { id: "v" })).toBe("12.50");
	});

	test("primitives", () => {
		expect(cell({ v: "task" }, { id: "v" })).toBe("task");
		expect(cell({ v: 0 }, { id: "v" })).toBe("0");
		expect(cell({ v: false }, { id: "v" })).toBe("false");
		expect(cell({}, { id: "v" })).toBe("");
		expect(cell({ v: null }, { id: "v" })).toBe("");
	});

	test("template result", () => {
		const object = { type: "snet", date: new Date(2026, 3, 2) };
		expect(
			cell(
				{ v: object },
				{
					id: "v",
					template: value => value.type.toUpperCase(),
				}
			)
		).toBe("SNET");
		expect(
			cell(
				{ v: "kept" },
				{
					id: "v",
					template: () => ({ type: "snet" }) as unknown as string,
				}
			)
		).toBe("");
	});

	test("optionsMap result", () => {
		const optionsMap = new Map<string, string>([
			["1", "Alex"],
			["2", "John"],
		]);
		expect(cell({ v: "1" }, { id: "v", optionsMap })).toBe("Alex");
		expect(cell({ v: ["1", "2"] }, { id: "v", optionsMap })).toBe(
			"Alex, John"
		);
	});
});
