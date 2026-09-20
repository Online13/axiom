import type { ThemeColors } from "@/theme/colors";
import type { States } from "@/theme/components";

type MenuColors = {
	background: string;
	item?: string;
	separator: string;
	foreground: string;
};

export type MenuTokens = {
	default: States<MenuColors, "pressed" | "destructive" | "disabled">;
};

export const menuTokens = (colors: ThemeColors): MenuTokens => ({
	default: {
		default: {
			background: colors.background.elevated,
			separator: colors.background.subtle,
			foreground: colors.content.default,
		},
		pressed: { item: colors.background.subtle },
		destructive: { foreground: colors.feedback.error },
		disabled: { foreground: colors.content.disabled },
	},
});
