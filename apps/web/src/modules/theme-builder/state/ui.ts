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

/** What the canvas shows: the app's screens, or the components on one sheet. */
export type CanvasView = "preview" | "system";

/**
 * The modes switched on from the canvas toolbar: `pick` makes a click on a
 * part of a mockup open the roles that paint it; `slides` walks the screens
 * one at a time, with the arrow keys or the buttons under them.
 */
export type CanvasTool = "pick" | "slides";

/** The foldable sections of the sidebar. */
export type SidebarSection = "spacing" | "colors" | "fonts" | "shape";

/**
 * A page that slides over the sidebar sections: one value being picked — a
 * role in one scheme, the face of one font role, or the preset — or the list
 * of every color role, whose values open a page of their own on top of it.
 */
export type SidebarPage =
	| { kind: "color"; path: string; scheme: ColorScheme }
	| { kind: "colors" }
	| { kind: "font"; role: "heading" | "body" }
	| { kind: "preset" };

export type UiState = {
	scheme: ColorScheme;
	device: DeviceKind;
	view: CanvasView;
	/** The screen brought forward on the canvas; the others dim behind it. */
	focusedScreen: string | null;
	tools: Record<CanvasTool, boolean>;
	exportOpen: boolean;
	loadOpen: boolean;
	exportOptions: ExportOptions;
	status: string;
	/** The pages open over the sections, the last one in view; none shows the sections. */
	pages: SidebarPage[];
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
	view: "preview",
	focusedScreen: null,
	tools: { pick: false, slides: false },
	exportOpen: false,
	loadOpen: false,
	exportOptions: { ...defaultExportOptions },
	status: "Changes apply instantly.",
	pages: [],
	sidebarOpen: true,
	sections: { spacing: true, colors: true, fonts: false, shape: false },
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
syncObservable(ui$.view, {
	persist: {
		name: "axiom.theme-builder.view",
		plugin: ObservablePersistLocalStorage,
	},
});
syncObservable(ui$.tools, {
	persist: {
		name: "axiom.theme-builder.tools",
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

// The control that opened each page gets the focus back when it closes.
let openers: (HTMLElement | null)[] = [];

/** Slides a page over the sections, or over the page in view. */
export function navigate(page: SidebarPage) {
	openers.push(
		typeof document === "undefined"
			? null
			: (document.activeElement as HTMLElement | null),
	);
	ui$.pages.set([...ui$.pages.peek(), page]);
}

/** Swaps the page in view for another, as when a color page changes scheme. */
export function replacePage(page: SidebarPage) {
	ui$.pages.set([...ui$.pages.peek().slice(0, -1), page]);
}

/** Opens a page straight over the sections, closing any other. */
export function openPage(page: SidebarPage) {
	openers = [null];
	ui$.pages.set([page]);
}

/** Back one page, focus on whatever opened it. */
export function back() {
	const pages = ui$.pages.peek();
	if (!pages.length) return;
	ui$.pages.set(pages.slice(0, -1));
	openers.pop()?.focus({ preventScroll: true });
}

export const announce = (message: string) => ui$.status.set(message);
