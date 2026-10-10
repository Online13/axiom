import type { ViewProps } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { iconColor, type IconColor, type IconSize } from "./icon";
import type { IconComponent, IconComponentProps } from "./icon-types";

type IconGlyphProps = IconComponentProps & { glyph: IconComponent };

export function IconGlyph({ glyph: Glyph, ...props }: IconGlyphProps) {
	return <Glyph {...props} />;
}

export function useIconStyles(
	size: IconSize | number,
	color: IconColor | (string & {}),
) {
	// The glyph takes its size and color as props, not as styles, and it comes from the project's
	// icon registry: it can't be wrapped once with `withUnistyles`. This is the theme-in-logic case.
	const { theme } = useUnistyles();
	const dimension =
		typeof size === "number" ? size : theme.tokens.sizes.icon[size];

	return {
		frame: ({ style }: Pick<ViewProps, "style">) => ({
			style: [styles.frame(dimension), style],
		}),
		glyph: { size: dimension, color: iconColor(theme.colors, color) },
	};
}

const styles = StyleSheet.create({
	frame: (dimension: number) => ({
		alignItems: "center",
		justifyContent: "center",
		width: dimension,
		height: dimension,
	}),
});
