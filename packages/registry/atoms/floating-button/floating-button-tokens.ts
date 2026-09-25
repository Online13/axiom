import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type FloatingButtonColors = {
	background: string;
	foreground: string;
	border?: string;
};
type FloatingButtonStates = States<
	FloatingButtonColors,
	"pressed" | "disabled"
>;

export type FloatingButtonTokens = {
	radius: number;
	solid: FloatingButtonStates;
	tinted: FloatingButtonStates;
};

export const floatingButtonTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): FloatingButtonTokens => ({
	radius: tokens.radius.full,
	solid: {
		default: {
			background: colors.primary.default,
			foreground: colors.primary.on,
		},
		pressed: { background: colors.primary.pressed },
		disabled: {
			background: colors.border.default,
			foreground: colors.content.disabled,
		},
	},
	tinted: {
		default: {
			background: colors.background.elevated,
			foreground: colors.content.default,
			border: colors.border.default,
		},
		pressed: { background: colors.background.subtle },
		disabled: { foreground: colors.content.disabled },
	},
});
