import type { ComponentPropsWithRef, ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { Text } from "@/components/ui/text";
import type { Spacing } from "@/theme";

import { useSeparatorStyles } from "./separator.styles";

export type SpacingToken = keyof Spacing;

export type SeparatorOrientation = "horizontal" | "vertical";
export type SeparatorVariant = "default" | "subtle";
export type SeparatorInset =
	SpacingToken | { start?: SpacingToken; end?: SpacingToken };

export type SeparatorProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	orientation?: SeparatorOrientation;
	/** `default` between blocks, `subtle` inside a surface such as a card. */
	variant?: SeparatorVariant;
	/** Defaults to the `hairline` metric. */
	thickness?: number;
	/** Space left empty at the start and end of the line, to align it with content. */
	inset?: SeparatorInset;
	/** Margin on both sides of the line, along the cross axis. */
	spacing?: SpacingToken;
	/** Text centered in a horizontal separator, with a line on each side. */
	label?: ReactNode;
	/** Hides the separator from screen readers. */
	decorative?: boolean;
	style?: StyleProp<ViewStyle>;
};

export function Separator({
	orientation = "horizontal",
	variant = "default",
	thickness,
	inset,
	spacing = 0,
	label,
	decorative = true,
	...props
}: SeparatorProps) {
	const styles = useSeparatorStyles();

	const accessibility = decorative
		? {
				accessibilityElementsHidden: true,
				importantForAccessibility: "no-hide-descendants" as const,
			}
		: { accessible: true, accessibilityRole: "none" as const };

	if (orientation === "horizontal" && label !== undefined) {
		return (
			<View
				{...props}
				{...accessibility}
				{...styles.labelled(inset, spacing, props)}
			>
				<View {...styles.line(variant, thickness)} />
				{typeof label === "string" ? (
					<Text variant="footnote" color="muted">
						{label}
					</Text>
				) : (
					label
				)}
				<View {...styles.line(variant, thickness)} />
			</View>
		);
	}

	return (
		<View
			{...props}
			{...accessibility}
			{...styles.separator(
				orientation,
				variant,
				thickness,
				inset,
				spacing,
				props,
			)}
		/>
	);
}
