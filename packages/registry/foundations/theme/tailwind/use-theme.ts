import { useColorScheme } from "react-native";

import { dark, light, type Theme } from "../theme";

/**
 * The theme matching the system color scheme. No provider needed.
 *
 * Components take their colors and token values from here, in `style`, and keep `className` for the
 * layout that doesn't depend on the theme: the same values as the other variants, and the same
 * classes with NativeWind and Uniwind. To force a scheme, call
 * `Appearance.setColorScheme('light' | 'dark')`, or `'unspecified'` to follow the system again.
 */
export function useTheme(): Theme {
	return useColorScheme() === "dark" ? dark : light;
}
