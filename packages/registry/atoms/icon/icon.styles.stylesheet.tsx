import { StyleSheet, type ViewProps } from "react-native";

import { useTheme } from "@/theme";

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
	const { tokens, colors } = useTheme();
	const dimension = typeof size === "number" ? size : tokens.sizes.icon[size];

	return {
		frame: ({ style }: Pick<ViewProps, "style">) => ({
			style: [styles.frame, { width: dimension, height: dimension }, style],
		}),
		glyph: { size: dimension, color: iconColor(colors, color) },
	};
}

const styles = StyleSheet.create({
	frame: {
		alignItems: "center",
		justifyContent: "center",
	},
});
