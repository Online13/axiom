import { StyleSheet } from "react-native-unistyles";

import { dark, light, type Theme } from "./theme";

/**
 * Registers the themes with Unistyles. Import this file once, at the app entry point, before any
 * component renders:
 *
 * ```ts
 * // index.ts
 * import "@/theme/unistyles";
 * import "expo-router/entry";
 * ```
 *
 * To switch schemes at runtime, call `UnistylesRuntime.setTheme('light' | 'dark')`.
 */
type AxiomThemes = { light: Theme; dark: Theme };

declare module "react-native-unistyles" {
	export interface UnistylesThemes extends AxiomThemes {}
}

// Noty is light-only: its dark palette mirrors the light one, so following the system scheme
// would put light status bar glyphs on a white screen.
StyleSheet.configure({
	themes: { light, dark },
	settings: { initialTheme: "light" },
});
