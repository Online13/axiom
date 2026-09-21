// The single source of truth for the builder. Everything on screen — the
// phones, the role tables, the ramps, the code block — is derived from
// `theme$`, so a seed change lands everywhere in one pass.

import { observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { loadFont } from "../lib/fonts";
import {
	decodeTheme,
	defaultTheme,
	encodeTheme,
	type SeedName,
	type Theme,
} from "../lib/theme";

const DRAFT_KEY = "axiom.theme-builder.draft";

/** The theme being edited. */
export const theme$ = observable<Theme>({ ...defaultTheme });

syncObservable(theme$, {
	persist: { name: DRAFT_KEY, plugin: ObservablePersistLocalStorage },
});

/**
 * A URL carrying a theme wins over the persisted draft — that is what makes a
 * shared link open on the right theme. Runs once, after persistence has
 * hydrated.
 */
export function hydrateFromUrl() {
	if (typeof location === "undefined" || location.search.length <= 1) return;
	theme$.set(decodeTheme(location.search));
}

/** Mirrors the theme into the address bar so the page is always shareable. */
export function syncUrl(theme: Theme) {
	if (typeof history === "undefined") return;
	history.replaceState(null, "", `${location.pathname}?${encodeTheme(theme)}`);
}

/* ---------- Mutations ---------- */

export const setSeed = (name: SeedName, hex: string) =>
	theme$.seeds[name].set(hex.toLowerCase());

export const setFont = (family: string) => {
	loadFont(family);
	theme$.font.set(family);
};

export const resetTheme = () =>
	theme$.set({ ...defaultTheme, name: theme$.name.peek() });
