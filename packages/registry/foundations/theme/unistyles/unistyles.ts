import { StyleSheet } from "react-native-unistyles";

import { dark, light, type Theme } from "../theme";

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
 * `adaptiveThemes` follows the system color scheme on its own: no provider, and no re-render when
 * the scheme changes. To force a scheme, call `UnistylesRuntime.setTheme('light' | 'dark')`.
 */
type AxiomThemes = { light: Theme; dark: Theme };

declare module "react-native-unistyles" {
	export interface UnistylesThemes extends AxiomThemes {}
}

StyleSheet.configure({
	themes: { light, dark },
	settings: { adaptiveThemes: true },
});
