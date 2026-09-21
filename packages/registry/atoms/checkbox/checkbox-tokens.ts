import type { ThemeColors } from "@/theme/colors";
import type { States } from "@/theme/components/states";

type CheckboxColors = {
	background?: string;
	border: string;
	indicator: string;
};

export type CheckboxTokens = {
	default: States<CheckboxColors, "checked" | "invalid" | "disabled">;
};

export const checkboxTokens = (colors: ThemeColors): CheckboxTokens => ({
	default: {
		default: {
			border: colors.border.strong,
			indicator: colors.content.inverse,
		},
		checked: { background: colors.content.link, border: colors.content.link },
		invalid: { border: colors.feedback.error },
		disabled: {
			border: colors.border.subtle,
			indicator: colors.content.disabled,
		},
	},
});
