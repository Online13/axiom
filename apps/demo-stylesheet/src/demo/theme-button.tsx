import { useSegments } from "expo-router";
import { useState } from "react";
import { Appearance, useColorScheme } from "react-native";

import { FloatingButton } from "@/components/ui/floating-button";
import { useTheme } from "@/theme";

type Scheme = "light" | "dark";

const LABEL: Record<Scheme, string> = { light: "Light", dark: "Dark" };

/** Toggles Light ↔ Dark on every screen, to check each component in both themes. */
export function ThemeButton() {
	const { tokens } = useTheme();
	const segments = useSegments();
	const system = useColorScheme();
	const [scheme, setScheme] = useState<Scheme>(
		system === "dark" ? "dark" : "light",
	);

	const toggle = () => {
		const next: Scheme = scheme === "dark" ? "light" : "dark";
		setScheme(next);
		Appearance.setColorScheme(next);
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
					? tokens.metrics.touchTarget + tokens.spacing[1] * 2
					: 0
			}
			accessibilityLabel={`Theme: ${LABEL[scheme]}. Switch to ${LABEL[scheme === "dark" ? "light" : "dark"]}`}
			onPress={toggle}
		/>
	);
}
