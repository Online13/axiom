// Everything that is a view preference rather than part of the theme: which
// tab is open, how the mockups are rendered, which overlay is up.

import { observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import type { ColorScheme } from "@docs/lib/tokens";
import { defaultExportOptions, type ExportOptions } from "../lib/export";
import type { SeedName } from "../lib/theme";

/**
 * The demo apps the theme is judged on, plus the inspection views.
 * `label` names the tab, `name` and `tagline` head the preview.
 */
export const appTabs = {
	music: {
		label: "Music",
		name: "Wave",
		tagline: "Music for wherever you are.",
	},
	travel: {
		label: "Travel",
		name: "Roam",
		tagline: "Go somewhere slower.",
	},
	fitness: {
		label: "Fitness",
		name: "Pulse",
		tagline: "Move a little more every day.",
	},
	finance: {
		label: "Finance",
		name: "North",
		tagline: "Your money, at a glance.",
	},
} as const;

export type AppTab = keyof typeof appTabs;

export const inspectTabs = {
	components: "Components",
	roles: "Color roles",
	palettes: "Palette",
	code: "Code",
} as const;

export type InspectTab = keyof typeof inspectTabs;
export type Tab = AppTab | InspectTab;

export const isAppTab = (tab: Tab): tab is AppTab => tab in appTabs;

export type DeviceKind = "ios" | "android";

export type UiState = {
	tab: Tab;
	scheme: ColorScheme;
	device: DeviceKind;
	settingsOpen: boolean;
	exportOpen: boolean;
	loadOpen: boolean;
	exportOptions: ExportOptions;
	status: string;
	/** The seed last picked on a phone; `at` lets the same seed be picked twice. */
	focusedSeed: { name: SeedName; at: number } | null;
};

export const ui$ = observable<UiState>({
	tab: "music",
	scheme: "light",
	device: "ios",
	settingsOpen: false,
	exportOpen: false,
	loadOpen: false,
	exportOptions: { ...defaultExportOptions },
	status: "Changes apply instantly.",
	focusedSeed: null,
});

// Only the render settings are worth remembering between visits; the open
// overlays and the status line are not.
syncObservable(ui$.scheme, {
	persist: {
		name: "axiom.theme-builder.scheme",
		plugin: ObservablePersistLocalStorage,
	},
});
syncObservable(ui$.device, {
	persist: {
		name: "axiom.theme-builder.device",
		plugin: ObservablePersistLocalStorage,
	},
});

export const announce = (message: string) => ui$.status.set(message);
