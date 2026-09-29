import { describe, expect, test } from "bun:test";
import { join } from "node:path";

import { detectPackageManager, installCommand } from "../src/install.ts";
import { tempDir } from "./fixtures.ts";

describe("detectPackageManager", () => {
	test("reads the lockfile", () => {
		expect(detectPackageManager(tempDir({ "bun.lock": "" }))).toBe("bun");
		expect(detectPackageManager(tempDir({ "bun.lockb": "" }))).toBe("bun");
		expect(detectPackageManager(tempDir({ "pnpm-lock.yaml": "" }))).toBe("pnpm");
		expect(detectPackageManager(tempDir({ "yarn.lock": "" }))).toBe("yarn");
		expect(detectPackageManager(tempDir({ "package-lock.json": "" }))).toBe("npm");
	});

	test("walks up to a monorepo's root lockfile, and falls back to npm", () => {
		const root = tempDir({ "pnpm-lock.yaml": "", "apps/mobile/package.json": "{}" });
		expect(detectPackageManager(join(root, "apps/mobile"))).toBe("pnpm");
		expect(detectPackageManager(tempDir())).toBe("npm");
	});
});

describe("installCommand", () => {
	const project = (lockfile: string | undefined, dependencies: object) =>
		tempDir({
			"package.json": { dependencies },
			...(lockfile ? { [lockfile]: "" } : {}),
		});

	test("goes through expo install in an Expo project", () => {
		expect(installCommand(project("bun.lock", { expo: "54" }), ["expo-symbols"])).toEqual(
			["bun", "expo", "install", "expo-symbols"],
		);
		expect(installCommand(project(undefined, { expo: "54" }), ["expo-symbols"])).toEqual(
			["npx", "expo", "install", "expo-symbols"],
		);
	});

	test("uses the package manager's own command otherwise", () => {
		const rn = { "react-native": "0.81" };
		expect(installCommand(project("pnpm-lock.yaml", rn), ["a", "b"])).toEqual([
			"pnpm",
			"add",
			"a",
			"b",
		]);
		expect(installCommand(project(undefined, rn), ["a"])).toEqual(["npm", "install", "a"]);
	});
});
