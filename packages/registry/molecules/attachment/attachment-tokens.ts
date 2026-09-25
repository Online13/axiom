import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type AttachmentColors = {
	background: string;
	border: string;
	/** File name. */
	text: string;
	/** Size, progress and error message. */
	meta: string;
	/** Background of the thumbnail, behind the file icon. */
	thumbnail: string;
	/** The file icon itself. */
	icon: string;
	progressTrack: string;
	progressFill: string;
};
type AttachmentStates = States<
	AttachmentColors,
	"uploading" | "done" | "error"
>;

export type AttachmentTokens = {
	row: AttachmentStates;
	tile: AttachmentStates;
};

const base = (colors: ThemeColors): AttachmentColors => ({
	background: colors.background.elevated,
	border: colors.border.default,
	text: colors.content.default,
	meta: colors.content.muted,
	thumbnail: colors.background.subtle,
	icon: colors.content.muted,
	progressTrack: colors.border.subtle,
	progressFill: colors.content.link,
});

export const attachmentTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): AttachmentTokens => ({
	row: {
		default: base(colors),
		done: { meta: colors.feedback.success },
		error: {
			border: colors.feedback.error,
			meta: colors.feedback.error,
			icon: colors.feedback.error,
		},
	},
	tile: {
		default: { ...base(colors), background: colors.background.subtle },
		done: { meta: colors.feedback.success },
		error: {
			border: colors.feedback.error,
			meta: colors.feedback.error,
			icon: colors.feedback.error,
		},
	},
});
