import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type ItemColors = { background?: string; divider: string };

export type ItemTokens = {
	default: States<ItemColors, "pressed" | "selected">;
};

export const itemTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): ItemTokens => ({
	default: {
		default: { divider: colors.border.default },
		pressed: { background: colors.background.subtle },
		selected: { background: colors.feedback.infoSubtle },
	},
});
