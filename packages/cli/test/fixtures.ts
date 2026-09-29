import { afterEach } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { DEFAULT_ALIASES, type ProjectConfig } from "../src/types.ts";

/** The real registry, for tests that check the CLI against what it actually ships. */
export const REGISTRY_ROOT = join(import.meta.dirname, "../../registry");

const dirs: string[] = [];
afterEach(() => {
	for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

/** A temporary folder holding `files` (path → content, objects written as JSON), removed after the test. */
export function tempDir(files: Record<string, string | object> = {}) {
	const dir = mkdtempSync(join(tmpdir(), "axiom-cli-"));
	dirs.push(dir);
	for (const [path, content] of Object.entries(files)) {
		const file = join(dir, path);
		mkdirSync(dirname(file), { recursive: true });
		writeFileSync(
			file,
			typeof content === "string" ? content : JSON.stringify(content, null, 2),
		);
	}
	return dir;
}

/** An Expo app whose tsconfig resolves `@/*` to `src/`, like Expo's own template. */
export function tempProject(
	files: Record<string, string | object> = {},
	dependencies: Record<string, string> = { expo: "54.0.0", "react-native": "0.81.0" },
) {
	return tempDir({
		"package.json": { name: "app", dependencies },
		"tsconfig.json": { compilerOptions: { paths: { "@/*": ["./src/*"] } } },
		"src/.keep": "",
		...files,
	});
}

export function config(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
	return {
		styling: "stylesheet",
		aliases: { ...DEFAULT_ALIASES },
		items: [],
		...overrides,
	};
}
