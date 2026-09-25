import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type SegmentedControlColors = {
	track: string;
	indicator: string;
	border: string;
	foreground: string;
};

export type SegmentedControlTokens = {
	/** Radius of the track. The indicator follows it, minus its inset. */
	radius: number;
	default: States<SegmentedControlColors, "selected" | "disabled">;
};

export const segmentedControlTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): SegmentedControlTokens => ({
	radius: tokens.radius.md,
	default: {
		default: {
			track: colors.background.subtle,
			indicator: colors.background.elevated,
			border: colors.border.default,
			foreground: colors.content.muted,
		},
		selected: { foreground: colors.content.default },
		disabled: { foreground: colors.content.disabled },
	},
});
