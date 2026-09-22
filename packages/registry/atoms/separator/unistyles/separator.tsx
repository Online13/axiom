import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Text } from "@/components/ui/text";
import type { Spacing } from "@/theme";

type SpacingToken = keyof Spacing;

export type SeparatorOrientation = "horizontal" | "vertical";
export type SeparatorVariant = "default" | "subtle";
export type SeparatorInset =
	| SpacingToken
	| { start?: SpacingToken; end?: SpacingToken };

export type SeparatorProps = {
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

const insetStart = (inset: SeparatorInset | undefined): SpacingToken =>
	typeof inset === "object" ? (inset.start ?? 0) : (inset ?? 0);
const insetEnd = (inset: SeparatorInset | undefined): SpacingToken =>
	typeof inset === "object" ? (inset.end ?? 0) : (inset ?? 0);

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
	const accessibility = decorative
		? {
				accessibilityElementsHidden: true,
				importantForAccessibility: "no-hide-descendants" as const,
			}
		: { accessible: true, accessibilityRole: "none" as const };

	if (orientation === "horizontal" && label !== undefined) {
		return (
			<View
				{...accessibility}
				style={[styles.labelled(inset, spacing), style]}
			>
				<View style={styles.line(variant, thickness)} />
				{typeof label === "string" ? (
					<Text variant="footnote" color="muted">
						{label}
					</Text>
				) : (
					label
				)}
				<View style={styles.line(variant, thickness)} />
			</View>
		);
	}

	return (
		<View
			{...accessibility}
			style={[
				styles.separator(orientation, variant, thickness, inset, spacing),
				style,
			]}
		/>
	);
}

const styles = StyleSheet.create((theme) => ({
	separator: (
		orientation: SeparatorOrientation,
		variant: SeparatorVariant,
		thickness: number | undefined,
		inset: SeparatorInset | undefined,
		spacing: SpacingToken,
	) => {
		const size = thickness ?? theme.tokens.metrics.hairline;
		const start = theme.tokens.spacing[insetStart(inset)];
		const end = theme.tokens.spacing[insetEnd(inset)];
		const margin = theme.tokens.spacing[spacing];

		return {
			backgroundColor: theme.colors.border[variant],
			...(orientation === "horizontal"
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
					}),
		};
	},
	labelled: (inset: SeparatorInset | undefined, spacing: SpacingToken) => ({
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[3],
		marginVertical: theme.tokens.spacing[spacing],
		marginStart: theme.tokens.spacing[insetStart(inset)],
		marginEnd: theme.tokens.spacing[insetEnd(inset)],
	}),
	line: (variant: SeparatorVariant, thickness: number | undefined) => ({
		flex: 1,
		height: thickness ?? theme.tokens.metrics.hairline,
		backgroundColor: theme.colors.border[variant],
	}),
}));
