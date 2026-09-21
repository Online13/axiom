import type { ThemeColors } from "@/theme/colors";
import type { States } from "@/theme/components/states";

type SlotColors = {
	/** Inside of an empty slot. */
	background: string;
	border: string;
	/** The dot, or the digit in a box. */
	content: string;
};
type SlotStates = States<
	SlotColors,
	"filled" | "error" | "success" | "disabled"
>;

type KeyColors = {
	background: string;
	text: string;
	/** The ABC / DEF line under the digit. */
	letters: string;
};
type KeyStates = States<KeyColors, "pressed" | "disabled">;

export type PasscodeTokens = {
	slot: { dot: SlotStates; box: SlotStates };
	key: { round: KeyStates; flat: KeyStates };
};

export const passcodeTokens = (colors: ThemeColors): PasscodeTokens => ({
	slot: {
		dot: {
			default: {
				background: "transparent",
				border: colors.border.strong,
				content: colors.content.default,
			},
			filled: { background: colors.content.default },
			error: {
				background: colors.feedback.error,
				border: colors.feedback.error,
				content: colors.feedback.error,
			},
			success: {
				background: colors.feedback.success,
				border: colors.feedback.success,
				content: colors.feedback.success,
			},
			disabled: {
				background: colors.content.disabled,
				border: colors.border.subtle,
				content: colors.content.disabled,
			},
		},
		box: {
			default: {
				background: colors.background.default,
				border: colors.border.default,
				content: colors.content.default,
			},
			filled: { border: colors.border.strong },
			error: {
				background: colors.feedback.errorSubtle,
				border: colors.feedback.error,
				content: colors.feedback.error,
			},
			success: {
				background: colors.feedback.successSubtle,
				border: colors.feedback.success,
				content: colors.feedback.success,
			},
			disabled: {
				background: colors.background.subtle,
				border: colors.border.subtle,
				content: colors.content.disabled,
			},
		},
	},
	key: {
		round: {
			default: {
				background: colors.background.subtle,
				text: colors.content.default,
				letters: colors.content.muted,
			},
			pressed: { background: colors.border.subtle },
			disabled: {
				text: colors.content.disabled,
				letters: colors.content.disabled,
			},
		},
		flat: {
			default: {
				background: "transparent",
				text: colors.content.default,
				letters: colors.content.muted,
			},
			pressed: { background: colors.background.subtle },
			disabled: {
				text: colors.content.disabled,
				letters: colors.content.disabled,
			},
		},
	},
});
