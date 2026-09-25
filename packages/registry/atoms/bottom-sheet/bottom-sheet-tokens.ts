import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type BottomSheetColors = { background: string; handle: string };

export type BottomSheetTokens = {
	default: States<BottomSheetColors, never>;
};

export const bottomSheetTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): BottomSheetTokens => ({
	default: {
		default: {
			background: colors.background.elevated,
			handle: colors.border.strong,
		},
	},
});
