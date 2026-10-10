// Runs the real CLI, as a user would, against the real registry. No terminal is attached, so the
// CLI never prompts: every answer comes from a flag, and what it can't decide makes it fail.
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";

import { readRegistry } from "../src/registry.ts";
import { STYLINGS, variantOf } from "../src/types.ts";
import { REGISTRY_ROOT, tempDir, tempProject } from "./fixtures.ts";

const CLI = join(import.meta.dirname, "../src/index.ts");

function axiom(cwd: string, ...args: string[]) {
	const { exitCode, stdout, stderr } = Bun.spawnSync(
		["bun", CLI, ...args, "--registry", REGISTRY_ROOT, "--cwd", cwd],
		{ env: { ...process.env, NO_COLOR: "1" }, stdin: "ignore" },
	);
	return { code: exitCode, output: stdout.toString() + stderr.toString() };
}

function init(cwd: string, styling = "stylesheet") {
	const result = axiom(cwd, "init", "--styling", styling, "--no-install");
	expect(result.output).toContain("written");
	expect(result.code).toBe(0);
	return result;
}

function files(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? files(path) : [path];
	});
}

const IMPORT = /(?:\bfrom\s+|\bimport\s*\(\s*|\bimport\s+)['"]([^'"]+)['"]/g;
const RESOLVED = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

/** Alias and relative imports of the project's code that point to no file, as `file: specifier`. */
function unresolvedImports(cwd: string): string[] {
	const src = join(cwd, "src");
	return files(src)
		.filter((file) => [".ts", ".tsx"].includes(extname(file)))
		.flatMap((file) =>
			[...readFileSync(file, "utf8").matchAll(IMPORT)]
				.map(([, specifier]) => specifier)
				.filter((specifier) => {
					const base = specifier.startsWith("@/")
						? join(src, specifier.slice(2))
						: specifier.startsWith(".")
							? resolve(dirname(file), specifier)
							: undefined;
					return base && !RESOLVED.some((suffix) => existsSync(base + suffix));
				})
				.map((specifier) => `${relative(cwd, file)}: ${specifier}`),
		);
}

const readJson = (cwd: string, path: string) =>
	JSON.parse(readFileSync(join(cwd, path), "utf8"));

describe("init", () => {
	test("sets up the foundations, the core primitives and axiom.json", () => {
		const cwd = tempProject();
		const { output } = init(cwd);

		expect(readJson(cwd, "axiom.json")).toMatchObject({
			styling: "stylesheet",
			aliases: { theme: "@/theme", components: "@/components/ui" },
			items: ["haptics", "overlay", "portal", "slot", "tappable", "theme", "tokens"],
		});
		expect(existsSync(join(cwd, "src/theme/components/index.ts"))).toBe(true);
		expect(existsSync(join(cwd, "src/components/core/tappable.tsx"))).toBe(true);
		// Without --install, the command to run is printed instead.
		expect(output).toContain("npx expo install");
		expect(unresolvedImports(cwd)).toEqual([]);
	});

	test("refuses to run twice without --force", () => {
		const cwd = tempProject();
		init(cwd);
		const again = axiom(cwd, "init", "--styling", "stylesheet", "--no-install");
		expect(again.code).toBe(1);
		expect(again.output).toContain("already has an axiom.json");

		const forced = axiom(cwd, "init", "--styling", "unistyles", "--no-install", "--force");
		expect(forced.code).toBe(0);
		expect(readJson(cwd, "axiom.json").styling).toBe("unistyles");
	});

	test("needs every answer from a flag without a terminal", () => {
		const { code, output } = axiom(tempProject(), "init", "--no-install");
		expect(code).toBe(1);
		expect(output).toContain("pass --styling stylesheet or --styling unistyles");
	});

	test("copies nothing into a project whose tsconfig doesn't resolve the aliases", () => {
		const cwd = tempProject({ "tsconfig.json": { compilerOptions: {} } });
		const { code, output } = axiom(cwd, "init", "--styling", "stylesheet", "--no-install");
		expect(code).toBe(1);
		expect(output).toContain(`Add "@/*": ["./src/*"] to "compilerOptions.paths"`);
		expect(existsSync(join(cwd, "axiom.json"))).toBe(false);
	});

	test("refuses a folder that isn't a React Native app", () => {
		const cwd = tempProject({}, { react: "19" });
		const { code, output } = axiom(cwd, "init", "--styling", "stylesheet", "--no-install");
		expect(code).toBe(1);
		expect(output).toContain("doesn't depend on react-native or expo");
	});
});

describe("add", () => {
	test("copies an item with its dependencies and registers its tokens", () => {
		const cwd = tempProject();
		init(cwd);
		const { code, output } = axiom(cwd, "add", "button", "--icons", "expo-symbols");
		expect(code).toBe(0);

		const config = readJson(cwd, "axiom.json");
		expect(config.icons).toBe("expo-symbols");
		expect(config.items).toEqual(expect.arrayContaining(["button", "icon", "text"]));
		expect(readFileSync(join(cwd, "src/theme/components/index.ts"), "utf8")).toContain(
			"button: buttonTokens(colors, tokens),",
		);
		expect(output).toContain("expo install expo-symbols");
		expect(unresolvedImports(cwd)).toEqual([]);
	});

	test("without items, copies axiom.json's items again, and changes nothing", () => {
		const cwd = tempProject();
		init(cwd);
		axiom(cwd, "add", "button", "--icons", "expo-symbols");
		const { code, output } = axiom(cwd, "add");
		expect(code).toBe(0);
		expect(output).toMatch(/0 written, \d+ unchanged, 0 kept\./);
	});

	test("keeps an edited file without a terminal, and overwrites it with --overwrite", () => {
		const cwd = tempProject();
		init(cwd);
		axiom(cwd, "add", "text");
		const file = join(cwd, "src/components/ui/text.tsx");
		writeFileSync(file, "// mine\n");

		const kept = axiom(cwd, "add", "text");
		expect(kept.output).toContain("Kept your version of src/components/ui/text.tsx");
		expect(readFileSync(file, "utf8")).toBe("// mine\n");

		axiom(cwd, "add", "text", "--overwrite");
		expect(readFileSync(file, "utf8")).not.toBe("// mine\n");
	});

	test("needs --icons for an item that draws icons", () => {
		const cwd = tempProject();
		init(cwd);
		const { code, output } = axiom(cwd, "add", "icon");
		expect(code).toBe(1);
		expect(output).toContain("pass --icons expo-symbols or --icons custom");
	});

	test("fails on an unknown item, and without axiom.json", () => {
		const cwd = tempProject();
		const noConfig = axiom(cwd, "add", "button");
		expect(noConfig.code).toBe(1);
		expect(noConfig.output).toContain("No axiom.json");

		init(cwd);
		const unknown = axiom(cwd, "add", "nope");
		expect(unknown.code).toBe(1);
		expect(unknown.output).toContain('Unknown item "nope"');
	});

	// The widest check there is: every item of the registry, copied together, with every import resolving.
	const registry = readRegistry(REGISTRY_ROOT);
	const stylings = STYLINGS.filter((styling) =>
		registry.items.every((item) => !item.variants || variantOf(item, styling)),
	);
	for (const styling of stylings) {
		test(`every item of the registry, with ${styling}`, () => {
			const cwd = tempProject();
			init(cwd, styling);
			const { code, output } = axiom(
				cwd,
				"add",
				...registry.items.map((item) => item.name),
				"--icons",
				"expo-symbols",
				"--navigation",
				"expo-router",
			);
			expect(output).toContain("written");
			expect(code).toBe(0);
			expect(readJson(cwd, "axiom.json").items).toHaveLength(registry.items.length);
			expect(unresolvedImports(cwd)).toEqual([]);
		});
	}
});

describe("sync", () => {
	test("restores deleted files and keeps edited ones", () => {
		const cwd = tempProject();
		init(cwd);
		axiom(cwd, "add", "button", "--icons", "expo-symbols");
		const items = readJson(cwd, "axiom.json").items;
		const deleted = join(cwd, "src/components/ui/button.tsx");
		const edited = join(cwd, "src/components/ui/text.tsx");
		rmSync(deleted);
		writeFileSync(edited, "// mine\n");

		const { code, output } = axiom(cwd, "sync");
		expect(code).toBe(0);
		expect(existsSync(deleted)).toBe(true);
		expect(readFileSync(edited, "utf8")).toBe("// mine\n");
		expect(output).toMatch(/1 written/);
		expect(readJson(cwd, "axiom.json").items).toEqual(items);
	});

	test("sets up a project with the same items as another one", () => {
		const source = tempProject();
		init(source);
		axiom(source, "add", "button", "--icons", "expo-symbols");

		const target = tempProject({ "axiom.json": readJson(source, "axiom.json") });
		const { code } = axiom(target, "sync");
		expect(code).toBe(0);
		const list = (cwd: string) =>
			files(join(cwd, "src")).map((file) => relative(cwd, file)).sort();
		expect(list(target)).toEqual(list(source));
		expect(unresolvedImports(target)).toEqual([]);
	});

	/** A project with button, where a component, a core primitive and a theme file were edited. */
	function editedProject() {
		const cwd = tempProject();
		init(cwd);
		axiom(cwd, "add", "button", "--icons", "expo-symbols");
		const edited = {
			components: join(cwd, "src/components/ui/text.tsx"),
			core: join(cwd, "src/components/core/tappable.tsx"),
			theme: join(cwd, "src/theme/components/button.ts"),
		};
		for (const file of Object.values(edited)) writeFileSync(file, "// mine\n");
		const mine = (file: string) => readFileSync(file, "utf8") === "// mine\n";
		return { cwd, edited, mine };
	}

	test("--keep and --overwrite update the levels that aren't kept", () => {
		const { cwd, edited, mine } = editedProject();
		const { code, output } = axiom(cwd, "sync", "--keep", "core,theme", "--overwrite");
		expect(code).toBe(0);
		expect(mine(edited.components)).toBe(false);
		expect(mine(edited.core)).toBe(true);
		expect(mine(edited.theme)).toBe(true);
		expect(output).toMatch(/1 written/);
	});

	test("--keep none overwrites every level", () => {
		const { cwd, edited, mine } = editedProject();
		expect(axiom(cwd, "sync", "--keep", "none", "--overwrite").code).toBe(0);
		expect(Object.values(edited).some(mine)).toBe(false);
		expect(unresolvedImports(cwd)).toEqual([]);
	});

	test("--keep alone keeps the files nobody can be asked about", () => {
		const { cwd, edited, mine } = editedProject();
		const { code, output } = axiom(cwd, "sync", "--keep", "core,theme");
		expect(code).toBe(0);
		expect(mine(edited.components)).toBe(true);
		expect(output).toContain("--overwrite");
	});

	test("--keep refuses an unknown level", () => {
		const { cwd } = editedProject();
		const { code, output } = axiom(cwd, "sync", "--keep", "tokens");
		expect(code).toBe(1);
		expect(output).toContain('Unknown level "tokens"');
	});

	test("fails without axiom.json", () => {
		const { code, output } = axiom(tempProject(), "sync");
		expect(code).toBe(1);
		expect(output).toContain("No axiom.json");
	});

	test("--help prints its usage", () => {
		const { code, output } = axiom(tempDir(), "sync", "--help");
		expect(code).toBe(0);
		expect(output).toContain("Usage: axiom sync");
	});
});

describe("add --standalone", () => {
	test("writes one file importing only npm packages, and no axiom.json", () => {
		const cwd = tempProject();
		const { code } = axiom(
			cwd,
			"add",
			"button",
			"--standalone",
			"--styling",
			"stylesheet",
			"--icons",
			"expo-symbols",
		);
		expect(code).toBe(0);
		expect(files(join(cwd, "src")).map((file) => relative(cwd, file)).sort()).toEqual([
			"src/.keep",
			"src/components/ui/button.tsx",
		]);
		const imports = [
			...readFileSync(join(cwd, "src/components/ui/button.tsx"), "utf8").matchAll(IMPORT),
		].map(([, specifier]) => specifier);
		expect(imports.filter((specifier) => /^(@\/|\.)/.test(specifier))).toEqual([]);
		expect(existsSync(join(cwd, "axiom.json"))).toBe(false);
	});

	// NativeWind and Uniwind read the theme through `useTheme()` like stylesheet, and import `cx` from
	// the theme: a helper, written into the file rather than resolved from the theme. The two files
	// differ where the tools do, like the icon's color.
	for (const name of ["badge", "switch"]) {
		test(`${name} with nativewind and uniwind: a self-contained file each`, () => {
			const written = ["nativewind", "uniwind"].map((styling) => {
				const cwd = tempProject();
				const { code } = axiom(
					cwd,
					"add",
					name,
					"--standalone",
					"--styling",
					styling,
					"--icons",
					"expo-symbols",
				);
				expect(code).toBe(0);
				return readFileSync(join(cwd, `src/components/ui/${name}.tsx`), "utf8");
			});
			for (const content of written) {
				const imports = [...content.matchAll(IMPORT)].map(([, specifier]) => specifier);
				expect(imports.filter((specifier) => /^(@\/|\.)/.test(specifier))).toEqual([]);
				expect(content).not.toContain("useTheme");
				if (content.includes("cx(")) expect(content).toContain("function cx(");
			}
		});
	}

	test("refuses an item with no standalone form", () => {
		const { code, output } = axiom(
			tempProject(),
			"add",
			"portal",
			"--standalone",
			"--styling",
			"stylesheet",
		);
		expect(code).toBe(1);
		expect(output).toContain("isn't available standalone");
	});
});

describe("usage", () => {
	test("--help prints the usage and succeeds", () => {
		const { code, output } = axiom(tempDir(), "add", "--help");
		expect(code).toBe(0);
		expect(output).toContain("Usage: axiom add");
	});

	test("an unknown command prints the usage and fails", () => {
		const { code, output } = axiom(tempDir(), "remove");
		expect(code).toBe(1);
		expect(output).toContain("Usage: axiom <command>");
	});
});
