// Checks that every styling variant of an item exposes the same API as `stylesheet`.
//
// A file named after its variant (`button.styles.unistyles.tsx`) is compared with its `.stylesheet`
// sibling, and a file of a variant folder (`foundations/theme/unistyles/index.ts`) with the file at
// the same path in the `stylesheet` folder. Both must export the same names, every exported `*Props`
// type must have the same props with the same optionality, and every exported component the same
// static parts (`Card.Header`). Prop types are not compared: style types differ between variants.
// Files only one variant has (the theme's `use-theme.ts` / `unistyles.ts`) are skipped, and the
// differences listed in `ALLOWED` are expected.
//
// Run `scripts/tsconfig.ts` first: the programs are built from the configs it writes.
//
//   bun scripts/parity.ts
import { existsSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";

import {
	STYLINGS,
	VARIANTS_OF,
	isCssStyling,
	type Styling,
} from "../../cli/src/types.ts";

const root = join(import.meta.dirname, "..");
const REFERENCE = "stylesheet";

// Differences a variant is meant to have, as `<file of the variant>: <line>`.
const ALLOWED = new Set([
	// Unistyles reads the theme through its own hooks: there is no `useTheme` to re-export.
	"foundations/theme/unistyles/index.ts: export useTheme",
	// Tailwind components merge their own classes with the caller's `className`.
	"foundations/theme/tailwind/index.ts: export cx",
]);

const configOf = (variant: Styling) => `tsconfig.${variant}.json`;

function program(variant: Styling): ts.Program {
	const path = join(root, configOf(variant));
	const { config } = ts.readConfigFile(path, ts.sys.readFile);
	const parsed = ts.parseJsonConfigFileContent(config, ts.sys, root);
	return ts.createProgram(parsed.fileNames, parsed.options);
}

// Every `<layer>/<item>/<variant>` folder of the registry, recursively.
function variantFolders(dir: string, variant: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		if (!entry.isDirectory() || entry.name.startsWith(".")) return [];
		const path = join(dir, entry.name);
		return entry.name === variant ? [path] : variantFolders(path, variant);
	});
}

// Every file named after `variant`, with the reference it is compared to.
function suffixedFiles(variant: string): [file: string, reference: string][] {
	const suffix = new RegExp(`\\.${variant}(\\.tsx?)$`);
	return readdirSync(root, { withFileTypes: true, recursive: true })
		.filter(
			(entry) =>
				entry.isFile() &&
				suffix.test(entry.name) &&
				!/(^|\/)(node_modules|\.generated)(\/|$)/.test(
					relative(root, entry.parentPath),
				),
		)
		.map((entry) => {
			// A styles file is `.ts` or `.tsx` on its own: the reference may have the other extension.
			const base = join(
				entry.parentPath,
				entry.name.replace(suffix, `.${REFERENCE}`),
			);
			return [
				join(entry.parentPath, entry.name),
				existsSync(`${base}.ts`) ? `${base}.ts` : `${base}.tsx`,
			];
		});
}

function filesIn(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true, recursive: true })
		.filter((entry) => entry.isFile() && /\.tsx?$/.test(entry.name))
		.map((entry) => join(entry.parentPath, entry.name));
}

// The public surface of a file, one line per fact, so two files compare as two sets.
function surface(prog: ts.Program, file: string): Set<string> {
	const checker = prog.getTypeChecker();
	const source = prog.getSourceFile(file);
	const lines = new Set<string>();
	if (!source) return lines;
	const module = checker.getSymbolAtLocation(source);
	if (!module) return lines;

	for (let symbol of checker.getExportsOfModule(module)) {
		const name = symbol.getName();
		lines.add(`export ${name}`);
		if (symbol.flags & ts.SymbolFlags.Alias)
			symbol = checker.getAliasedSymbol(symbol);

		if (name.endsWith("Props") && symbol.flags & ts.SymbolFlags.Type) {
			const type = checker.getDeclaredTypeOfSymbol(symbol);
			for (const prop of checker.getPropertiesOfType(type)) {
				const optional = prop.flags & ts.SymbolFlags.Optional ? "?" : "";
				lines.add(`${name}.${prop.getName()}${optional}`);
			}
		}

		// Static parts of a component: `Card.Header`, `Field.Label`.
		if (symbol.flags & ts.SymbolFlags.Value && /^[A-Z]/.test(name)) {
			const type = checker.getTypeOfSymbol(symbol);
			if (type.getCallSignatures().length > 0)
				for (const part of checker.getPropertiesOfType(type))
					if (/^[A-Z]/.test(part.getName()))
						lines.add(`${name}.${part.getName()} (part)`);
		}
	}
	return lines;
}

const reference = program(REFERENCE);
let failures = 0;
let compared = 0;

for (const variant of STYLINGS) {
	if (variant === REFERENCE || !existsSync(join(root, configOf(variant))))
		continue;
	const other = program(variant);

	const pairs = [
		// NativeWind and Uniwind also compile the theme's `tailwind` folder, which they share.
		...VARIANTS_OF[variant].flatMap((source) => [
			...variantFolders(root, source).flatMap((folder) =>
				filesIn(folder).map((file): [string, string] => [
					file,
					join(folder, "..", REFERENCE, relative(folder, file)),
				]),
			),
			...suffixedFiles(source),
		]),
	];
	for (const [file, referenceFile] of pairs) {
		if (!existsSync(referenceFile)) continue;
		compared++;

		const expected = surface(reference, referenceFile);
		const actual = surface(other, file);
		const allowed = (line: string) =>
			ALLOWED.has(`${relative(root, file)}: ${line}`) ||
			// NativeWind and Uniwind give React Native's props a `className` (and `cssInterop`,
			// `placeholderClassName`…), so the props built on them have it too.
			(isCssStyling(variant) &&
				/^\w+Props\.(\w*ClassName|className|cssInterop)\?$/.test(line));
		const missing = [...expected].filter(
			(line) => !actual.has(line) && !allowed(line),
		);
		const extra = [...actual].filter(
			(line) => !expected.has(line) && !allowed(line),
		);
		if (missing.length === 0 && extra.length === 0) continue;

		failures++;
		console.log(`\n${relative(root, file)} differs from ${REFERENCE}:`);
		for (const line of missing) console.log(`  - ${line}`);
		for (const line of extra) console.log(`  + ${line}`);
	}
}

console.log(
	`\n${compared} files compared, ${failures} with a different API than ${REFERENCE}.`,
);
process.exit(failures > 0 ? 1 : 0);
