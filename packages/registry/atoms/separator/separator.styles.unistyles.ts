import { StyleSheet } from "react-native-unistyles";

import type {
	SeparatorInset,
	SeparatorOrientation,
	SeparatorProps,
	SeparatorVariant,
	SpacingToken,
} from "./separator";

const insetStart = (inset: SeparatorInset | undefined): SpacingToken =>
	typeof inset === "object" ? (inset.start ?? 0) : (inset ?? 0);
const insetEnd = (inset: SeparatorInset | undefined): SpacingToken =>
	typeof inset === "object" ? (inset.end ?? 0) : (inset ?? 0);

export function useSeparatorStyles() {
	return {
		separator: (
			orientation: SeparatorOrientation,
			variant: SeparatorVariant,
			thickness: number | undefined,
			inset: SeparatorInset | undefined,
			spacing: SpacingToken,
			{ style }: Pick<SeparatorProps, "style">,
		) => ({
			style: [
				styles.separator(orientation, variant, thickness, inset, spacing),
				style,
			],
		}),
		labelled: (
			inset: SeparatorInset | undefined,
			spacing: SpacingToken,
			{ style }: Pick<SeparatorProps, "style">,
		) => ({ style: [styles.labelled(inset, spacing), style] }),
		line: (variant: SeparatorVariant, thickness: number | undefined) => ({
			style: styles.line(variant, thickness),
		}),
	};
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
