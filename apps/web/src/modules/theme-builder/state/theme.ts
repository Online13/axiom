// The single source of truth for the builder. Everything on screen — the
// phones, the role tables, the ramps, the code block — is derived from
// `theme$`, so a change lands everywhere in one pass.

import { observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import type { ColorScheme } from "@docs/lib/tokens";
import { loadFont } from "../lib/fonts";
import {
	decodeTheme,
	defaultTheme,
	encodeTheme,
	normalizeTheme,
	type Theme,
} from "../lib/theme";

const DRAFT_KEY = "axiom.theme-builder.draft";

/**
 * The theme being edited. Always seeded with copies: edits mutate the nested
 * objects in place, and must never reach `defaultTheme` or a preset.
 */
export const theme$ = observable<Theme>(structuredClone(defaultTheme));

syncObservable(theme$, {
	persist: {
		name: DRAFT_KEY,
		plugin: ObservablePersistLocalStorage,
		// A draft from an earlier version of the builder may lack fields. No
		// draft at all stays empty, so it never overrides a theme from the URL.
		transform: {
			load: (value: unknown) =>
				value == null ? value : normalizeTheme(value),
		},
	},
});

/**
 * A URL carrying a theme wins over the persisted draft — that is what makes a
 * shared link open on the right theme. Runs once, on import: the localStorage
 * draft is already loaded, and nothing has rewritten the address bar yet.
 */
function hydrateFromUrl() {
	if (typeof location === "undefined" || location.search.length <= 1) return;
	theme$.set(decodeTheme(location.search));
}

hydrateFromUrl();

/** Mirrors the theme into the address bar so the page is always shareable. */
export function syncUrl(theme: Theme) {
	if (typeof history === "undefined") return;
	history.replaceState(null, "", `${location.pathname}?${encodeTheme(theme)}`);
}

/* ---------- Mutations ---------- */

/** Sets one role of one scheme to a primitive, or back to the shipped value with `null`. */
export function setRole(
	path: string,
	scheme: ColorScheme,
	value: string | null,
) {
	const entry = { ...theme$.overrides[path].peek() };
	if (value === null) delete entry[scheme];
	else entry[scheme] = value;
	if (Object.keys(entry).length) theme$.overrides[path].set(entry);
	else theme$.overrides[path].delete();
}

export const resetRoles = () => theme$.overrides.set({});

export type FontRole = keyof Theme["fonts"];

export const setFont = (role: FontRole, family: string) => {
	loadFont(family);
	theme$.fonts[role].set(family);
};

/** Loads both faces of a theme. */
export const loadThemeFonts = (theme: Theme) => {
	loadFont(theme.fonts.heading);
	loadFont(theme.fonts.body);
};

export const resetTheme = () =>
	theme$.set({ ...structuredClone(defaultTheme), name: theme$.name.peek() });

/** Replaces the whole theme with a ready-made one, fonts loaded. */
export const applyPreset = (theme: Theme) => {
	loadThemeFonts(theme);
	theme$.set(structuredClone(theme));
};
