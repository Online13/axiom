import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

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
	const { tokens, colors } = useTheme();

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
				orientation === "horizontal"
					? {
							height: thickness ?? tokens.metrics.hairline,
							marginVertical: tokens.spacing[spacing],
							marginStart: tokens.spacing[insetStart(inset)],
							marginEnd: tokens.spacing[insetEnd(inset)],
						}
					: {
							width: thickness ?? tokens.metrics.hairline,
							alignSelf: "stretch" as const,
							marginHorizontal: tokens.spacing[spacing],
							marginTop: tokens.spacing[insetStart(inset)],
							marginBottom: tokens.spacing[insetEnd(inset)],
						},
				{ backgroundColor: colors.border[variant] },
				style,
			],
		}),
		labelled: (
			inset: SeparatorInset | undefined,
			spacing: SpacingToken,
			{ style }: Pick<SeparatorProps, "style">,
		) => ({
			style: [
				styles.labelled,
				{
					gap: tokens.spacing[3],
					marginVertical: tokens.spacing[spacing],
					marginStart: tokens.spacing[insetStart(inset)],
					marginEnd: tokens.spacing[insetEnd(inset)],
				},
				style,
			],
		}),
		line: (variant: SeparatorVariant, thickness: number | undefined) => ({
			style: [
				styles.line,
				{
					height: thickness ?? tokens.metrics.hairline,
					backgroundColor: colors.border[variant],
				},
			],
		}),
	};
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
