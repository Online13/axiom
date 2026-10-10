import type { ComponentPropsWithRef, ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { useButtonGroupStyles } from "./button-group.styles";

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
	...props
}: ButtonGroupProps) {
	const styles = useButtonGroupStyles();

	return (
		<View {...props} {...styles.group(orientation, bordered, radius, props)}>
			{children}
		</View>
	);
}
