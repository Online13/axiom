import { describe, expect, test } from "bun:test";

import { readRegistry, resolveItems } from "../src/registry.ts";
import type { Registry, RegistryItem } from "../src/types.ts";
import { tempDir } from "./fixtures.ts";

const item = (name: string, internalDependencies?: string[]): RegistryItem => ({
	name,
	type: "atoms",
	...(internalDependencies ? { internalDependencies } : {}),
});

const names = (items: RegistryItem[]) => items.map((item) => item.name);

describe("resolveItems", () => {
	const registry: Registry = {
		items: [
			item("theme"),
			item("text", ["theme"]),
			item("icon", ["theme"]),
			item("button", ["icon", "text", "theme"]),
		],
	};

	test("lists the requested items, then what they depend on, each once", () => {
		expect(names(resolveItems(registry, ["button"]))).toEqual([
			"button",
			"icon",
			"theme",
			"text",
		]);
		expect(names(resolveItems(registry, ["text", "button"]))).toEqual([
			"text",
			"theme",
			"button",
			"icon",
		]);
	});

	test("names the item that requires an unknown one", () => {
		expect(() => resolveItems(registry, ["nope"])).toThrow('Unknown item "nope".');
		const broken: Registry = { items: [item("card", ["ghost"])] };
		expect(() => resolveItems(broken, ["card"])).toThrow(
			'Unknown item "ghost" (required by card).',
		);
	});

	test("refuses a circular dependency, with its path", () => {
		const circular: Registry = {
			items: [item("a", ["b"]), item("b", ["c"]), item("c", ["a"])],
		};
		expect(() => resolveItems(circular, ["a"])).toThrow(
			"Circular dependency: a → b → c → a.",
		);
	});
});

describe("readRegistry", () => {
	test("reads registry.json", () => {
		const root = tempDir({ "registry.json": { items: [item("theme")] } });
		expect(names(readRegistry(root).items)).toEqual(["theme"]);
	});

	test("fails on a folder without registry.json", () => {
		expect(() => readRegistry(tempDir())).toThrow("No registry.json in");
	});
});
