import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
	aliasToDir,
	detectNavigation,
	missingDependencies,
	parseNavigation,
	readConfig,
	writeConfig,
} from "../src/project.ts";
import { DEFAULT_ALIASES } from "../src/types.ts";
import { config, tempDir, tempProject } from "./fixtures.ts";

describe("readConfig", () => {
	test("fills the aliases and items it doesn't set", () => {
		const cwd = tempDir({
			"axiom.json": { styling: "unistyles", aliases: { theme: "~/theme" } },
		});
		expect(readConfig(cwd)).toEqual({
			styling: "unistyles",
			aliases: { ...DEFAULT_ALIASES, theme: "~/theme" },
			items: [],
		});
	});

	test("rejects unknown values", () => {
		const read = (json: object) => () => readConfig(tempDir({ "axiom.json": json }));
		expect(read({})).toThrow('"styling" must be one of');
		expect(read({ styling: "css" })).toThrow('"styling" must be one of');
		expect(read({ styling: "stylesheet", icons: "lucide" })).toThrow(
			'"icons" must be one of',
		);
		expect(read({ styling: "stylesheet", navigation: "router" })).toThrow(
			'"navigation" must be one of',
		);
	});

	test("fails without axiom.json", () => {
		expect(() => readConfig(tempDir())).toThrow("No axiom.json in");
	});
});

test("writeConfig always writes the keys in the same order, and reads back", () => {
	const cwd = tempDir();
	const written = config({ items: ["button"], navigation: "expo-router" });
	writeConfig(cwd, { ...written, $schema: "https://axiom.dev/schema.json" });

	const raw = readFileSync(join(cwd, "axiom.json"), "utf8");
	expect(Object.keys(JSON.parse(raw))).toEqual([
		"$schema",
		"styling",
		"navigation",
		"aliases",
		"items",
	]);
	expect(raw.endsWith("}\n")).toBe(true);
	expect(readConfig(cwd)).toMatchObject(written);
});

describe("aliasToDir", () => {
	test("maps an alias through the most specific tsconfig paths entry", () => {
		const cwd = tempDir({
			"tsconfig.json": {
				compilerOptions: {
					paths: { "@/*": ["./src/*"], "@/ui/*": ["./packages/ui/*"] },
				},
			},
		});
		expect(aliasToDir(cwd, "@/theme")).toBe(join(cwd, "src/theme"));
		expect(aliasToDir(cwd, "@/components/ui")).toBe(join(cwd, "src/components/ui"));
		expect(aliasToDir(cwd, "@/ui/button")).toBe(join(cwd, "packages/ui/button"));
	});

	test("fails on an alias no entry resolves", () => {
		const cwd = tempDir({ "tsconfig.json": { compilerOptions: {} } });
		expect(() => aliasToDir(cwd, "@/theme")).toThrow(
			`Alias "@/theme" doesn't match any "paths" entry`,
		);
		expect(() => aliasToDir(tempDir(), "@/theme")).toThrow("doesn't match");
	});
});

describe("navigation", () => {
	test("is detected from package.json, Expo Router first", () => {
		const detect = (dependencies: Record<string, string>) =>
			detectNavigation(tempProject({}, dependencies));
		expect(
			detect({ "expo-router": "6", "@react-navigation/native": "7" }),
		).toBe("expo-router");
		expect(detect({ "@react-navigation/native": "7" })).toBe("react-navigation");
		expect(detect({ "react-native": "0.81" })).toBe("react-native");
	});

	test("--navigation only takes a known library", () => {
		expect(parseNavigation("expo-router")).toBe("expo-router");
		expect(() => parseNavigation("router")).toThrow("--navigation must be one of");
	});
});

test("missingDependencies checks dependencies and devDependencies", () => {
	const cwd = tempDir({
		"package.json": {
			dependencies: { expo: "54" },
			devDependencies: { typescript: "6" },
		},
	});
	expect(missingDependencies(cwd, ["expo", "typescript", "expo-symbols"])).toEqual([
		"expo-symbols",
	]);
});
