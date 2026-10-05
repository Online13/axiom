import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type ChipColors = { background?: string; foreground: string; border?: string };
type ChipStates = States<ChipColors, "pressed" | "selected" | "disabled">;

export type ChipTokens = {
	radius: number;
	outline: ChipStates;
	filled: ChipStates;
};

export const chipTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): ChipTokens => ({
	radius: tokens.radius.full,
	outline: {
		default: {
			background: colors.background.default,
			foreground: colors.content.default,
			border: colors.border.default,
		},
		pressed: { background: colors.background.subtle },
		selected: {
			background: colors.primary.default,
			foreground: colors.primary.on,
			border: colors.primary.default,
		},
		disabled: {
			foreground: colors.content.disabled,
			border: colors.border.subtle,
		},
	},
	filled: {
		default: {
			background: colors.background.subtle,
			foreground: colors.content.default,
		},
		pressed: { background: colors.border.default },
		selected: {
			background: colors.primary.default,
			foreground: colors.primary.on,
		},
		disabled: { foreground: colors.content.disabled },
	},
});
