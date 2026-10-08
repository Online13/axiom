import type { ComponentPropsWithRef, ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { cx, useTheme } from "@/theme";

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
	className,
	style,
	...props
}: ButtonGroupProps) {
	const { tokens, colors, components } = useTheme();

	return (
		<View
			{...props}
			className={cx(
				"self-start overflow-hidden",
				orientation === "horizontal" ? "flex-row" : "flex-col",
				className,
			)}
			style={[
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
