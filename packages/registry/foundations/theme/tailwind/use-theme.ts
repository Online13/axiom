import { useColorScheme } from "react-native";

import { dark, light, type Theme } from "../theme";

/**
 * The theme matching the system color scheme. No provider needed.
 *
 * Components take their colors from classes, which follow the scheme on their own. They read this
 * for what no class can say: a color a prop wants as a value, like the stroke of an SVG path, and
 * the tokens of the components that animate their colors. To force a scheme, call
 * `Appearance.setColorScheme('light' | 'dark')`, or `'unspecified'` to follow the system again.
 */
export function useTheme(): Theme {
	return useColorScheme() === "dark" ? dark : light;
}
