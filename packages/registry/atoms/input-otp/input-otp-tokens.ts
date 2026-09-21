import type { ThemeColors } from "@/theme/colors";
import type { States } from "@/theme/components/states";

type InputOTPColors = {
	background: string;
	border: string;
	text: string;
	caret: string;
};

export type InputOTPTokens = {
	default: States<
		InputOTPColors,
		"active" | "invalid" | "success" | "disabled"
	>;
};

export const inputOtpTokens = (colors: ThemeColors): InputOTPTokens => ({
	default: {
		default: {
			background: colors.background.default,
			border: colors.border.default,
			text: colors.content.default,
			caret: colors.content.link,
		},
		active: { border: colors.border.focus },
		invalid: {
			background: colors.feedback.errorSubtle,
			border: colors.feedback.error,
			text: colors.feedback.error,
		},
		success: {
			background: colors.feedback.successSubtle,
			border: colors.feedback.success,
			text: colors.feedback.success,
		},
		disabled: {
			background: colors.background.subtle,
			border: colors.border.subtle,
			text: colors.content.disabled,
		},
	},
});
