import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type TabColors = {
	/** Label and icon of an item. */
	content: string;
	/** Behind a pill item; the underline of an underline item. */
	indicator: string;
	/** Background of the whole list. */
	background: string;
	/** Hairline under an underline list. */
	border: string;
};
type TabStates = States<TabColors, "selected" | "disabled">;

export type TabTokens = {
	underline: TabStates;
	pill: TabStates;
};

export const tabTokens = (colors: ThemeColors, tokens: Tokens): TabTokens => ({
	underline: {
		default: {
			content: colors.content.muted,
			indicator: colors.primary.default,
			background: "transparent",
			border: colors.border.subtle,
		},
		selected: { content: colors.content.default },
		disabled: { content: colors.content.disabled },
	},
	pill: {
		default: {
			content: colors.content.muted,
			indicator: colors.background.elevated,
			background: colors.background.subtle,
			border: "transparent",
		},
		selected: { content: colors.content.default },
		disabled: { content: colors.content.disabled },
	},
});
