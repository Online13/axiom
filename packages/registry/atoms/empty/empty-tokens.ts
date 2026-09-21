import type { ThemeColors } from "@/theme/colors";
import type { States } from "@/theme/components/states";

type EmptyColors = { media: string; icon: string };

export type EmptyTokens = {
	neutral: States<EmptyColors, never>;
	error: States<EmptyColors, never>;
};

export const emptyTokens = (colors: ThemeColors): EmptyTokens => ({
	neutral: {
		default: { media: colors.background.subtle, icon: colors.content.muted },
	},
	error: {
		default: {
			media: colors.feedback.errorSubtle,
			icon: colors.feedback.error,
		},
	},
});
