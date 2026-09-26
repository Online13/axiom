// Everything that is a view preference rather than part of the theme: how
// the mockups are rendered, which overlay is up.

import { observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import type { ColorScheme } from "@docs/lib/tokens";
import { defaultExportOptions, type ExportOptions } from "../lib/export";

/** The preview variables that paint one part of a mockup. */
export type Paint = {
	/** Text, icon or chart color. */
	text?: string;
	background?: string;
	border?: string;
};

export type DeviceKind = "ios" | "android";

/** The foldable sections of the sidebar. */
export type SidebarSection = "colors" | "fonts" | "shape" | "spacing";

/**
 * What the sidebar shows: its sections, or one value being picked — a role in
 * one scheme, the face of one font role, or the preset — on a page that slides over them.
 */
export type SidebarPage =
	| { kind: "root" }
	| { kind: "color"; path: string; scheme: ColorScheme }
	| { kind: "font"; role: "heading" | "body" }
	| { kind: "preset" };

export type UiState = {
	scheme: ColorScheme;
	device: DeviceKind;
	exportOpen: boolean;
	loadOpen: boolean;
	exportOptions: ExportOptions;
	status: string;
	page: SidebarPage;
	/** The sidebar floats over the canvas, and can be put away. */
	sidebarOpen: boolean;
	sections: Record<SidebarSection, boolean>;
	/**
	 * The roles last picked on a phone or in the sidebar, most telling
	 * first (text, then background, then border); `at` lets a pick repeat.
	 */
	focusedRoles: { paths: string[]; at: number } | null;
};

export const ui$ = observable<UiState>({
	scheme: "light",
	device: "ios",
	exportOpen: false,
	loadOpen: false,
	exportOptions: { ...defaultExportOptions },
	status: "Changes apply instantly.",
	page: { kind: "root" },
	sidebarOpen: true,
	sections: { colors: true, fonts: false, shape: false, spacing: false },
	focusedRoles: null,
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
syncObservable(ui$.sidebarOpen, {
	persist: {
		name: "axiom.theme-builder.sidebar",
		plugin: ObservablePersistLocalStorage,
	},
});
syncObservable(ui$.sections, {
	persist: {
		name: "axiom.theme-builder.sections",
		plugin: ObservablePersistLocalStorage,
	},
});

// The control that opened a page gets the focus back when it closes.
let opener: HTMLElement | null = null;

/** Slides a page over the sidebar sections. */
export function navigate(page: Exclude<SidebarPage, { kind: "root" }>) {
	if (ui$.page.kind.peek() === "root" && typeof document !== "undefined")
		opener = document.activeElement as HTMLElement | null;
	ui$.page.set(page);
}

/** Back to the sections, focus on whatever opened the page. */
export function back() {
	ui$.page.set({ kind: "root" });
	const target = opener;
	opener = null;
	target?.focus({ preventScroll: true });
}

export const announce = (message: string) => ui$.status.set(message);
