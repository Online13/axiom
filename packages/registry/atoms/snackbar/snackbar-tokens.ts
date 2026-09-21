import type { ThemeColors } from "@/theme/colors";
import type { States } from "@/theme/components/states";

type SnackbarColors = {
	background: string;
	foreground: string;
	action: string;
};

export type SnackbarTokens = {
	default: States<SnackbarColors, never>;
};

export const snackbarTokens = (colors: ThemeColors): SnackbarTokens => ({
	default: {
		default: {
			background: colors.background.inverse,
			foreground: colors.content.inverse,
			action: colors.feedback.info,
		},
	},
});
