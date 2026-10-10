import { cx } from "@/theme";
import { tokens } from "@/theme/tokens";

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

const COLOR: Record<SeparatorVariant, string> = {
	default: "bg-border",
	subtle: "bg-border-subtle",
};

// The thickness, the inset and the spacing are numbers chosen by the caller: they stay styles.
export function useSeparatorStyles() {
	return {
		separator: (
			orientation: SeparatorOrientation,
			variant: SeparatorVariant,
			thickness: number | undefined,
			inset: SeparatorInset | undefined,
			spacing: SpacingToken,
			{ className, style }: Pick<SeparatorProps, "className" | "style">,
		) => ({
			className: cx(
				orientation === "vertical" && "self-stretch",
				COLOR[variant],
				className,
			),
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
							marginHorizontal: tokens.spacing[spacing],
							marginTop: tokens.spacing[insetStart(inset)],
							marginBottom: tokens.spacing[insetEnd(inset)],
						},
				style,
			],
		}),
		labelled: (
			inset: SeparatorInset | undefined,
			spacing: SpacingToken,
			{ className, style }: Pick<SeparatorProps, "className" | "style">,
		) => ({
			className: cx("flex-row items-center gap-3", className),
			style: [
				{
					marginVertical: tokens.spacing[spacing],
					marginStart: tokens.spacing[insetStart(inset)],
					marginEnd: tokens.spacing[insetEnd(inset)],
				},
				style,
			],
		}),
		line: (variant: SeparatorVariant, thickness: number | undefined) => ({
			className: cx("flex-1", COLOR[variant]),
			style: { height: thickness ?? tokens.metrics.hairline },
		}),
	};
}
