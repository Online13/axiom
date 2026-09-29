import { describe, expect, test } from "bun:test";

import { registerTokens, tokenEntries } from "../src/tokens.ts";
import { DEFAULT_ALIASES, type RegistryItem } from "../src/types.ts";

const COMPONENTS = `import type { Colors } from '../colors';
// axiom:imports:start
// axiom:imports:end

export const components = (colors: Colors, tokens: Tokens) => ({
	// axiom:components:start
	// axiom:components:end
});
`;

const item = (name: string, tokens?: string): RegistryItem => ({
	name,
	type: "atoms",
	...(tokens ? { tokens } : {}),
});

test("tokenEntries keys each component with tokens in camelCase, sorted", () => {
	const items = [
		item("text"),
		item("icon-button", "icon-button-tokens.ts"),
		item("bottom-sheet", "bottom-sheet-tokens.ts"),
	];
	expect(tokenEntries(items, DEFAULT_ALIASES)).toEqual([
		{
			key: "bottomSheet",
			exportName: "bottomSheetTokens",
			specifier: "./bottom-sheet",
		},
		{
			key: "iconButton",
			exportName: "iconButtonTokens",
			specifier: "./icon-button",
		},
	]);
});

describe("registerTokens", () => {
	const entries = tokenEntries(
		[item("button", "button-tokens.ts"), item("icon-button", "t.ts")],
		DEFAULT_ALIASES,
	);

	test("adds one import and one entry per component, at the markers' indentation", () => {
		expect(registerTokens(COMPONENTS, entries)).toBe(`import type { Colors } from '../colors';
// axiom:imports:start
import { buttonTokens } from './button';
import { iconButtonTokens } from './icon-button';
// axiom:imports:end

export const components = (colors: Colors, tokens: Tokens) => ({
	// axiom:components:start
	button: buttonTokens(colors, tokens),
	iconButton: iconButtonTokens(colors, tokens),
	// axiom:components:end
});
`);
	});

	test("leaves registered components as they are", () => {
		const once = registerTokens(COMPONENTS, entries);
		expect(registerTokens(once, entries)).toBe(once);

		// A line the user edited still counts as registered.
		const edited = once.replace(
			"button: buttonTokens(colors, tokens),",
			"button: { ...buttonTokens(colors, tokens), radius: 0 },",
		);
		expect(registerTokens(edited, entries)).toBe(edited);
	});

	test("refuses a theme that predates per-component or shape tokens", () => {
		expect(() =>
			registerTokens(COMPONENTS.replace("// axiom:imports:end\n", ""), entries),
		).toThrow('no "// axiom:imports:end" marker');
		expect(() =>
			registerTokens(COMPONENTS.replace(", tokens: Tokens", ""), entries),
		).toThrow("passes only `colors`");
	});
});
