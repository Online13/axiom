// Everything that is a view preference rather than part of the theme: which
// tab is open, how the mockups are rendered, which overlay is up.

import { observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import type { ColorScheme } from "@docs/lib/tokens";
import { defaultExportOptions, type ExportOptions } from "../lib/export";

/** The demo apps the theme is judged on, plus the three inspection views. */
export const appTabs = {
	todo: { label: "Todo", caption: "A task list app" },
	productivity: { label: "Productivity", caption: "Focus and habits" },
	recipes: { label: "Recipes", caption: "A cooking app" },
	social: { label: "Social", caption: "A feed and profile" },
} as const;

export type AppTab = keyof typeof appTabs;

export const inspectTabs = {
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
};

export const ui$ = observable<UiState>({
	tab: "todo",
	scheme: "light",
	device: "ios",
	settingsOpen: false,
	exportOpen: false,
	loadOpen: false,
	exportOptions: { ...defaultExportOptions },
	status: "Changes apply instantly.",
});

// Only the render settings are worth remembering between visits; the open
// overlays and the status line are not.
syncObservable(ui$.scheme, {
	persist: { name: "axiom.theme-builder.scheme", plugin: ObservablePersistLocalStorage },
});
syncObservable(ui$.device, {
	persist: { name: "axiom.theme-builder.device", plugin: ObservablePersistLocalStorage },
});

export const announce = (message: string) => ui$.status.set(message);
