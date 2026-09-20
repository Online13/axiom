import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Text } from "@/components/ui/text";
import { useTheme, type Spacing } from "@/theme";

type SpacingToken = keyof Spacing;

export type SeparatorProps = {
	orientation?: "horizontal" | "vertical";
	/** `default` between blocks, `subtle` inside a surface such as a card. */
	variant?: "default" | "subtle";
	/** Defaults to the `hairline` metric. */
	thickness?: number;
	/** Space left empty at the start and end of the line, to align it with content. */
	inset?: SpacingToken | { start?: SpacingToken; end?: SpacingToken };
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
	style,
}: SeparatorProps) {
	const { tokens, colors } = useTheme();
	const horizontal = orientation === "horizontal";
	const size = thickness ?? tokens.metrics.hairline;
	const color = colors.border[variant];

	const start =
		tokens.spacing[
			typeof inset === "object" ? (inset.start ?? 0) : (inset ?? 0)
		];
	const end =
		tokens.spacing[
			typeof inset === "object" ? (inset.end ?? 0) : (inset ?? 0)
		];
	const margin = tokens.spacing[spacing];

	const accessibility = decorative
		? {
				accessibilityElementsHidden: true,
				importantForAccessibility: "no-hide-descendants" as const,
			}
		: { accessible: true, accessibilityRole: "none" as const };

	if (horizontal && label !== undefined) {
		return (
			<View
				{...accessibility}
				style={[
					styles.labelled,
					{
						gap: tokens.spacing[3],
						marginVertical: margin,
						marginStart: start,
						marginEnd: end,
					},
					style,
				]}
			>
				<View
					style={[styles.line, { height: size, backgroundColor: color }]}
				/>
				{typeof label === "string" ? (
					<Text variant="footnote" color="muted">
						{label}
					</Text>
				) : (
					label
				)}
				<View
					style={[styles.line, { height: size, backgroundColor: color }]}
				/>
			</View>
		);
	}

	return (
		<View
			{...accessibility}
			style={[
				horizontal
					? {
							height: size,
							marginVertical: margin,
							marginStart: start,
							marginEnd: end,
						}
					: {
							width: size,
							alignSelf: "stretch",
							marginHorizontal: margin,
							marginTop: start,
							marginBottom: end,
						},
				{ backgroundColor: color },
				style,
			]}
		/>
	);
}

const styles = StyleSheet.create({
	labelled: {
		flexDirection: "row",
		alignItems: "center",
	},
	line: {
		flex: 1,
	},
});
