import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type RadioColors = { border: string; indicator: string };

export type RadioTokens = {
	default: States<RadioColors, "checked" | "disabled">;
};

export const radioTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): RadioTokens => ({
	default: {
		default: {
			border: colors.border.strong,
			indicator: colors.primary.default,
		},
		checked: { border: colors.primary.default },
		disabled: {
			border: colors.border.subtle,
			indicator: colors.content.disabled,
		},
	},
});
