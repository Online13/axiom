import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type DialogColors = { background: string };

export type DialogTokens = {
	default: States<DialogColors, never>;
};

export const dialogTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): DialogTokens => ({
	default: {
		default: { background: colors.background.elevated },
	},
});
