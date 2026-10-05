import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type CheckboxColors = {
	background?: string;
	border: string;
	indicator: string;
};

export type CheckboxTokens = {
	default: States<CheckboxColors, "checked" | "invalid" | "disabled">;
};

export const checkboxTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): CheckboxTokens => ({
	default: {
		default: {
			border: colors.border.strong,
			indicator: colors.primary.on,
		},
		checked: {
			background: colors.primary.default,
			border: colors.primary.default,
		},
		invalid: { border: colors.feedback.error },
		disabled: {
			border: colors.border.subtle,
			indicator: colors.content.disabled,
		},
	},
});
