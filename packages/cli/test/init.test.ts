import { describe, expect, test } from "bun:test";

import {
	assertReactNativeProject,
	availableStylings,
	defaultAliases,
	parseStyling,
} from "../src/init.ts";
import { readRegistry } from "../src/registry.ts";
import type { Registry } from "../src/types.ts";
import { DEFAULT_ALIASES } from "../src/types.ts";
import { REGISTRY_ROOT, tempDir, tempProject } from "./fixtures.ts";

describe("availableStylings", () => {
	test("offers only the stylings every init item has a variant for", () => {
		const registry: Registry = {
			items: [
				{
					name: "theme",
					type: "foundations",
					variants: { stylesheet: {}, nativewind: {} },
				},
				{ name: "slot", type: "core" },
				{ name: "tappable", type: "core", variants: { stylesheet: {} } },
				{ name: "portal", type: "core" },
				{ name: "overlay", type: "core" },
			],
		};
		expect(availableStylings(registry)).toEqual(["stylesheet"]);
	});

	test("matches what the real registry ships", () => {
		expect(availableStylings(readRegistry(REGISTRY_ROOT))).toEqual([
			"stylesheet",
			"unistyles",
			"nativewind",
			"uniwind",
		]);
	});
});

test("--styling only takes an available styling", () => {
	expect(parseStyling("unistyles", ["stylesheet", "unistyles"])).toBe("unistyles");
	expect(() => parseStyling("uniwind", ["stylesheet"])).toThrow(
		"--styling must be one of stylesheet.",
	);
});

describe("defaultAliases", () => {
	test("keeps the defaults for a project importing through @/", () => {
		expect(defaultAliases(tempProject())).toEqual(DEFAULT_ALIASES);
		expect(defaultAliases(tempDir())).toEqual(DEFAULT_ALIASES);
	});

	test("follows the prefix the project already imports with", () => {
		const cwd = tempDir({
			"tsconfig.json": { compilerOptions: { paths: { "~/*": ["./app/*"] } } },
		});
		expect(defaultAliases(cwd)).toMatchObject({
			theme: "~/theme",
			components: "~/components/ui",
		});
	});
});

describe("assertReactNativeProject", () => {
	test("accepts an Expo or bare React Native app", () => {
		expect(() => assertReactNativeProject(tempProject())).not.toThrow();
		expect(() =>
			assertReactNativeProject(tempProject({}, { "react-native": "0.81" })),
		).not.toThrow();
	});

	test("refuses a folder that isn't one", () => {
		expect(() => assertReactNativeProject(tempDir())).toThrow("No package.json");
		expect(() =>
			assertReactNativeProject(tempProject({}, { react: "19" })),
		).toThrow("doesn't depend on react-native or expo");
	});
});
