import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type SwitchColors = { track: string; thumb: string };

export type SwitchTokens = {
	default: States<SwitchColors, "checked" | "disabled">;
};

export const switchTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): SwitchTokens => ({
	default: {
		default: {
			track: colors.border.default,
			thumb: colors.background.elevated,
		},
		checked: { track: colors.primary.default },
		disabled: { track: colors.border.subtle },
	},
});
