import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type IconButtonColors = {
	background?: string;
	foreground: string;
	border?: string;
};
type IconButtonStates = States<
	IconButtonColors,
	"pressed" | "selected" | "disabled"
>;

export type IconButtonTokens = {
	/** Corner radius of the `square` shape. The `circle` shape ignores it. */
	radius: number;
	ghost: IconButtonStates;
	tinted: IconButtonStates;
	outline: IconButtonStates;
	solid: IconButtonStates;
};

export const iconButtonTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): IconButtonTokens => ({
	radius: tokens.radius.md,
	ghost: {
		default: { foreground: colors.content.default },
		pressed: { background: colors.background.subtle },
		selected: { background: colors.background.subtle },
		disabled: { foreground: colors.content.disabled },
	},
	tinted: {
		default: {
			background: colors.background.subtle,
			foreground: colors.content.default,
		},
		pressed: { background: colors.border.default },
		selected: { background: colors.border.default },
		disabled: { foreground: colors.content.disabled },
	},
	outline: {
		default: {
			background: colors.background.default,
			foreground: colors.content.default,
			border: colors.border.default,
		},
		pressed: { background: colors.background.subtle },
		selected: { border: colors.border.focus },
		disabled: {
			foreground: colors.content.disabled,
			border: colors.border.subtle,
		},
	},
	solid: {
		default: {
			background: colors.primary.default,
			foreground: colors.primary.on,
		},
		pressed: { background: colors.primary.pressed },
		selected: { background: colors.primary.pressed },
		disabled: {
			background: colors.border.default,
			foreground: colors.content.disabled,
		},
	},
});
