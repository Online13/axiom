// The saved themes, kept in localStorage. `Save` writes the current theme in,
// `Load` lists what is there.

import { observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import type { Theme } from "../lib/theme";

export type SavedTheme = {
	id: string;
	name: string;
	savedAt: number;
	theme: Theme;
};

export const library$ = observable<{ themes: SavedTheme[] }>({ themes: [] });

syncObservable(library$, {
	persist: {
		name: "axiom.theme-builder.library",
		plugin: ObservablePersistLocalStorage,
	},
});

const id = () =>
	`${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/**
 * Saves the theme under its own name. Saving twice under the same name
 * overwrites, which is what people expect from a name they typed themselves.
 */
export function saveTheme(theme: Theme): SavedTheme {
	const entry: SavedTheme = {
		id: id(),
		name: theme.name.trim() || "Untitled",
		savedAt: Date.now(),
		theme: structuredClone(theme),
	};

	const existing = library$.themes
		.peek()
		.findIndex(
			(saved) => saved.name.toLowerCase() === entry.name.toLowerCase(),
		);

	if (existing >= 0)
		library$.themes[existing].set({
			...entry,
			id: library$.themes[existing].id.peek(),
		});
	else library$.themes.push(entry);

	return entry;
}

export function deleteTheme(id: string) {
	library$.themes.set((themes) => themes.filter((saved) => saved.id !== id));
}
