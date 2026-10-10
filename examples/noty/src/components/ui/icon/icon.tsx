import type { ComponentPropsWithRef } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

// The registry depends on the icon source chosen for the project, so it's imported through the alias.
import { icons, type IconName } from "@/components/ui/icon/icons";
import type { Theme } from "@/theme";

import type {
	IconRegistry,
	IconComponent,
	IconComponentProps,
} from "./icon-types";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

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

export type IconProps = Omit<ComponentPropsWithRef<typeof View>, "children"> & {
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
	...props
}: IconProps) {
	const { theme } = useUnistyles();
	const dimension =
		typeof size === "number" ? size : theme.tokens.sizes.icon[size];
	// Read through `IconRegistry`: with an empty registry (`custom` source), `icons[name]` would be `never`.
	const registry: IconRegistry = icons;
	const decorative = accessibilityLabel === undefined;

	return (
		<View
			{...props}
			accessible={!decorative}
			accessibilityRole={decorative ? undefined : "image"}
			accessibilityLabel={accessibilityLabel}
			accessibilityElementsHidden={decorative}
			importantForAccessibility={decorative ? "no-hide-descendants" : "yes"}
			style={[styles.frame(dimension), props.style]}
		>
			<IconGlyph
				glyph={registry[name]}
				strokeWidth={strokeWidth}
				size={dimension}
				color={iconColor(theme.colors, color)}
			/>
		</View>
	);
}

type IconGlyphProps = IconComponentProps & { glyph: IconComponent };

function IconGlyph({ glyph: Glyph, ...props }: IconGlyphProps) {
	return <Glyph {...props} />;
}

const styles = StyleSheet.create({
	frame: (dimension: number) => ({
		alignItems: "center",
		justifyContent: "center",
		width: dimension,
		height: dimension,
	}),
});
