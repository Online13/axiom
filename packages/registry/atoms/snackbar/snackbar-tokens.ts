import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type SnackbarColors = {
	background: string;
	foreground: string;
	action: string;
};

export type SnackbarTokens = {
	default: States<SnackbarColors, never>;
};

export const snackbarTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): SnackbarTokens => ({
	default: {
		default: {
			background: colors.background.inverse,
			foreground: colors.content.inverse,
			action: colors.feedback.info,
		},
	},
});
