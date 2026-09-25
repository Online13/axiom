import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type BarColors = {
	background: string;
	border: string;
};

type ItemColors = {
	/** Icon and label of an item. */
	content: string;
};
type ItemStates = States<ItemColors, "active" | "disabled">;

export type BottomTabBarTokens = {
	fixed: States<BarColors, never>;
	floating: States<BarColors, never>;
	item: ItemStates;
};

export const bottomTabBarTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): BottomTabBarTokens => ({
	fixed: {
		default: {
			background: colors.background.default,
			border: colors.border.subtle,
		},
	},
	floating: {
		default: {
			background: colors.background.elevated,
			border: colors.border.subtle,
		},
	},
	item: {
		default: { content: colors.content.muted },
		active: { content: colors.content.link },
		disabled: { content: colors.content.disabled },
	},
});
