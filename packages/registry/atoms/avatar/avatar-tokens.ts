import type { ThemeColors } from "@/theme/colors";
import type { States } from "@/theme/components/states";

type AvatarColors = { background: string; foreground: string; ring: string };
type AvatarStatusColors = {
	online: string;
	away: string;
	busy: string;
	offline: string;
};

export type AvatarTokens = {
	default: States<AvatarColors, never>;
	/** Color of the status dot. */
	status: States<AvatarStatusColors, never>;
};

export const avatarTokens = (colors: ThemeColors): AvatarTokens => ({
	default: {
		default: {
			background: colors.border.default,
			foreground: colors.content.muted,
			ring: colors.background.default,
		},
	},
	status: {
		default: {
			online: colors.feedback.success,
			away: colors.feedback.warning,
			busy: colors.feedback.error,
			offline: colors.content.subtle,
		},
	},
});
