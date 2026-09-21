import type { ThemeColors } from "@/theme/colors";
import type { States } from "@/theme/components/states";

type ToolBarColors = {
	background: string;
	border: string;
	/** Icon and label of an action. */
	action: string;
	separator: string;
};
type ToolBarStates = States<ToolBarColors, never>;

type ActionColors = {
	content: string;
	/** Behind a selected toggle action. */
	background: string;
};
type ActionStates = States<
	ActionColors,
	"selected" | "destructive" | "disabled"
>;

export type ToolBarTokens = {
	docked: ToolBarStates;
	floating: ToolBarStates;
	action: ActionStates;
};

export const toolBarTokens = (colors: ThemeColors): ToolBarTokens => ({
	docked: {
		default: {
			background: colors.background.default,
			border: colors.border.subtle,
			action: colors.content.link,
			separator: colors.border.default,
		},
	},
	floating: {
		default: {
			background: colors.background.elevated,
			border: colors.border.subtle,
			action: colors.content.link,
			separator: colors.border.default,
		},
	},
	action: {
		default: { content: colors.content.link, background: "transparent" },
		selected: { background: colors.feedback.infoSubtle },
		destructive: { content: colors.feedback.error },
		disabled: { content: colors.content.disabled },
	},
});
