import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

// The registry depends on the icon source chosen for the project, so it's imported through the alias.
import { icons, type IconName } from "@/components/ui/icons";
import type { Theme } from "@/theme";

import type { IconRegistry } from "../icon-types";

export type IconSize = "sm" | "md" | "lg";

export type IconColor =
	| "default"
	| "muted"
	| "subtle"
	| "disabled"
	| "inverse"
	| "link"
	| "info"
	| "success"
	| "warning"
	| "error";

export type IconProps = {
	name: IconName;
	/** From the `icon` size tokens (16, 20, 24), or a number. */
	size?: IconSize | number;
	/** A theme color that follows light and dark. A raw color is accepted but won't follow the scheme. */
	color?: IconColor | (string & {});
	strokeWidth?: number;
	/** Makes the icon visible to screen readers. Without it, the icon is decorative and hidden. */
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
};

export function iconColor(
	colors: Theme["colors"],
	color: IconColor | (string & {}),
): string {
	if (color in colors.content)
		return colors.content[color as keyof Theme["colors"]["content"]];
	if (color in colors.feedback)
		return colors.feedback[color as keyof Theme["colors"]["feedback"]];
	return color;
}

export function Icon({
	name,
	size = "md",
	color = "default",
	strokeWidth,
	accessibilityLabel,
	style,
}: IconProps) {
	// The glyph takes its size and color as props, not as styles, and it comes from the project's
	// icon registry: it can't be wrapped once with `withUnistyles`. This is the theme-in-logic case.
	const { theme } = useUnistyles();
	// Read through `IconRegistry`: with an empty registry (`custom` source), `icons[name]` would be `never`.
	const registry: IconRegistry = icons;
	const Glyph = registry[name];
	const dimension =
		typeof size === "number" ? size : theme.tokens.sizes.icon[size];
	const decorative = accessibilityLabel === undefined;

	return (
		<View
			accessible={!decorative}
			accessibilityRole={decorative ? undefined : "image"}
			accessibilityLabel={accessibilityLabel}
			accessibilityElementsHidden={decorative}
			importantForAccessibility={decorative ? "no-hide-descendants" : "yes"}
			style={[styles.frame(dimension), style]}
		>
			<Glyph
				size={dimension}
				color={iconColor(theme.colors, color)}
				strokeWidth={strokeWidth}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	frame: (dimension: number) => ({
		alignItems: "center",
		justifyContent: "center",
		width: dimension,
		height: dimension,
	}),
});
