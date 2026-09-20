import type { ThemeColors } from "@/theme/colors";
import type { States } from "@/theme/components";

type BadgeColors = { background?: string; foreground: string; border?: string };
type BadgeStates = States<BadgeColors, never>;

export type BadgeTokens = {
	neutral: BadgeStates;
	info: BadgeStates;
	success: BadgeStates;
	warning: BadgeStates;
	error: BadgeStates;
	outline: BadgeStates;
	inverse: BadgeStates;
	/** Round counter and dot. `border` is the ring that detaches it from the element it sits on. */
	count: BadgeStates;
};

export const badgeTokens = (colors: ThemeColors): BadgeTokens => ({
	neutral: {
		default: {
			background: colors.background.subtle,
			foreground: colors.content.muted,
		},
	},
	info: {
		default: {
			background: colors.feedback.infoSubtle,
			foreground: colors.feedback.info,
		},
	},
	success: {
		default: {
			background: colors.feedback.successSubtle,
			foreground: colors.feedback.success,
		},
	},
	warning: {
		default: {
			background: colors.feedback.warningSubtle,
			foreground: colors.feedback.warning,
		},
	},
	error: {
		default: {
			background: colors.feedback.errorSubtle,
			foreground: colors.feedback.error,
		},
	},
	outline: {
		default: {
			foreground: colors.content.default,
			border: colors.border.default,
		},
	},
	inverse: {
		default: {
			background: colors.background.inverse,
			foreground: colors.content.inverse,
		},
	},
	count: {
		default: {
			background: colors.feedback.error,
			foreground: colors.content.inverse,
			border: colors.background.default,
		},
	},
});
