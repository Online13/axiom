import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type SearchBarColors = {
	background?: string;
	border?: string;
	text: string;
	placeholder: string;
	/** Search glyph, clear button and trailing content. */
	icon: string;
	caret: string;
	/** Label of the cancel button. */
	cancel: string;
};
type SearchBarStates = States<SearchBarColors, "focused" | "disabled">;

export type SearchBarTokens = {
	filled: SearchBarStates;
	outline: SearchBarStates;
};

export const searchBarTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): SearchBarTokens => ({
	filled: {
		default: {
			background: colors.background.subtle,
			text: colors.content.default,
			placeholder: colors.content.subtle,
			icon: colors.content.subtle,
			caret: colors.content.link,
			cancel: colors.content.link,
		},
		disabled: {
			text: colors.content.disabled,
			placeholder: colors.content.disabled,
			icon: colors.content.disabled,
			cancel: colors.content.disabled,
		},
	},
	outline: {
		default: {
			background: colors.background.default,
			border: colors.border.default,
			text: colors.content.default,
			placeholder: colors.content.subtle,
			icon: colors.content.subtle,
			caret: colors.content.link,
			cancel: colors.content.link,
		},
		focused: { border: colors.border.focus },
		disabled: {
			background: colors.background.subtle,
			border: colors.border.subtle,
			text: colors.content.disabled,
			placeholder: colors.content.disabled,
			icon: colors.content.disabled,
			cancel: colors.content.disabled,
		},
	},
});
