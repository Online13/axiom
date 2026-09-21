import type { ThemeColors } from "@/theme/colors";
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
	ghost: IconButtonStates;
	tinted: IconButtonStates;
	outline: IconButtonStates;
	solid: IconButtonStates;
};

export const iconButtonTokens = (colors: ThemeColors): IconButtonTokens => ({
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
			background: colors.background.inverse,
			foreground: colors.content.inverse,
		},
		pressed: { background: colors.content.muted },
		selected: { background: colors.content.muted },
		disabled: {
			background: colors.border.default,
			foreground: colors.content.disabled,
		},
	},
});
