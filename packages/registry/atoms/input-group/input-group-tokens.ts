import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type InputGroupColors = { addon?: string; divider: string };

// The group border, text and placeholder come from the `input` tokens.
export type InputGroupTokens = {
	default: States<InputGroupColors, "disabled">;
};

export const inputGroupTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): InputGroupTokens => ({
	default: {
		default: {
			addon: colors.background.subtle,
			divider: colors.border.default,
		},
		disabled: { divider: colors.border.subtle },
	},
});
