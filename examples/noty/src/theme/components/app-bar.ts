import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type AppBarColors = {
	background: string;
	border: string;
	title: string;
	/** The line under the title. */
	subtitle: string;
};

export type AppBarTokens = {
	default: States<AppBarColors, never>;
};

export const appBarTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): AppBarTokens => ({
	default: {
		default: {
			background: colors.background.default,
			border: colors.border.subtle,
			title: colors.content.default,
			subtitle: colors.content.muted,
		},
	},
});
