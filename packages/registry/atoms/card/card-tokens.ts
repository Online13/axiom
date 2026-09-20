import type { ThemeColors } from "@/theme/colors";
import type { States } from "@/theme/components";

type CardColors = { background: string; border?: string };
type CardStates = States<CardColors, "pressed">;

export type CardTokens = {
	elevated: CardStates;
	outlined: CardStates;
	filled: CardStates;
};

export const cardTokens = (colors: ThemeColors): CardTokens => ({
	elevated: {
		default: { background: colors.background.elevated },
		pressed: { background: colors.background.subtle },
	},
	outlined: {
		default: {
			background: colors.background.default,
			border: colors.border.default,
		},
		pressed: { background: colors.background.subtle },
	},
	filled: {
		default: { background: colors.background.subtle },
		pressed: { background: colors.border.subtle },
	},
});
