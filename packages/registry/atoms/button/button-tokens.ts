import type { ThemeColors } from "@/theme/colors";
import type { States } from "@/theme/components/states";

type ButtonColors = {
	background?: string;
	foreground: string;
	border?: string;
};
type ButtonStates = States<ButtonColors, "pressed" | "disabled">;

export type ButtonTokens = {
	solid: ButtonStates;
	outline: ButtonStates;
	ghost: ButtonStates;
	destructive: ButtonStates;
};

export const buttonTokens = (colors: ThemeColors): ButtonTokens => ({
	solid: {
		default: {
			background: colors.background.inverse,
			foreground: colors.content.inverse,
		},
		pressed: { background: colors.content.muted },
		disabled: {
			background: colors.border.default,
			foreground: colors.content.disabled,
		},
	},
	outline: {
		default: {
			background: colors.background.default,
			foreground: colors.content.default,
			border: colors.border.default,
		},
		pressed: { background: colors.background.subtle },
		disabled: {
			foreground: colors.content.disabled,
			border: colors.border.subtle,
		},
	},
	ghost: {
		default: { foreground: colors.content.default },
		pressed: { background: colors.background.subtle },
		disabled: { foreground: colors.content.disabled },
	},
	destructive: {
		default: {
			background: colors.feedback.error,
			foreground: colors.content.inverse,
		},
		pressed: { foreground: colors.feedback.errorSubtle },
		disabled: {
			background: colors.border.default,
			foreground: colors.content.disabled,
		},
	},
});
