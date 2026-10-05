import type { ComponentPropsWithRef, ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "@/theme";

export type ButtonGroupProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	/** Buttons, and a Separator between them where you want a line. */
	children?: ReactNode;
	orientation?: "horizontal" | "vertical";
	/** Draws a hairline around the group, for ghost buttons that read as one outlined control. */
	bordered?: boolean;
	/** Radius of the group's outer corners. Defaults to the theme's button radius. */
	radius?: number;
	style?: StyleProp<ViewStyle>;
};

/**
 * Rounds and clips the outer corners of the buttons inside it. The buttons stay ordinary:
 * square them with `style={{ borderRadius: 0 }}` and place a Separator where you want a line.
 * It doesn't track a selection: see SegmentedControl for that.
 */
export function ButtonGroup({
	children,
	orientation = "horizontal",
	bordered = false,
	radius,
	style,
	...props
}: ButtonGroupProps) {
	const { tokens, colors, components } = useTheme();

	return (
		<View
			{...props}
			style={[
				styles.group,
				orientation === "horizontal" ? styles.row : styles.column,
				{ borderRadius: radius ?? components.button.radius },
				bordered && {
					borderWidth: tokens.metrics.hairline,
					borderColor: colors.border.default,
				},
				style,
			]}
		>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	group: {
		alignSelf: "flex-start",
		overflow: "hidden",
	},
	row: {
		flexDirection: "row",
	},
	column: {
		flexDirection: "column",
	},
});
