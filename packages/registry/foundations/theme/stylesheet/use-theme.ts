import { useColorScheme } from "react-native";

import { dark, light, type Theme } from "../theme";

/**
 * The theme matching the system color scheme. No provider needed.
 * To force a scheme, call `Appearance.setColorScheme('light' | 'dark')`, or `'unspecified'` to follow the system again.
 */
export function useTheme(): Theme {
	return useColorScheme() === "dark" ? dark : light;
}
