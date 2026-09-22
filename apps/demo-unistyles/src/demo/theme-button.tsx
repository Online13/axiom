import { useSegments } from "expo-router";
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles";

import { FloatingButton } from "@/components/ui/floating-button";

type Scheme = "light" | "dark";

const LABEL: Record<Scheme, string> = { light: "Light", dark: "Dark" };

/** Toggles Light ↔ Dark on every screen, to check each component in both themes. */
export function ThemeButton() {
	// `rt` re-renders this button on every theme change, so its icon stays in sync.
	const { theme, rt } = useUnistyles();
	const segments = useSegments();
	const scheme: Scheme = rt.themeName === "dark" ? "dark" : "light";
	const next: Scheme = scheme === "dark" ? "light" : "dark";

	const toggle = () => {
		// The themes follow the system until the first manual switch; after it, the choice sticks.
		if (UnistylesRuntime.hasAdaptiveThemes)
			UnistylesRuntime.setAdaptiveThemes(false);
		UnistylesRuntime.setTheme(next);
	};

	return (
		<FloatingButton
			icon={scheme === "dark" ? "theme-dark" : "theme-light"}
			variant="tinted"
			// On the tab screens the button sits above the bar instead of covering it.
			// The bar adds its own padding around a touch-target-tall row; its safe
			// area is already part of the button's placement.
			offset={
				segments[0] === "(tabs)"
					? theme.tokens.metrics.touchTarget + theme.tokens.spacing[1] * 2
					: 0
			}
			accessibilityLabel={`Theme: ${LABEL[scheme]}. Switch to ${LABEL[next]}`}
			onPress={toggle}
		/>
	);
}
