import type { ThemeColors } from "@/theme/colors";
import type { States } from "@/theme/components";

type BottomSheetColors = { background: string; handle: string };

export type BottomSheetTokens = {
	default: States<BottomSheetColors, never>;
};

export const bottomSheetTokens = (colors: ThemeColors): BottomSheetTokens => ({
	default: {
		default: {
			background: colors.background.elevated,
			handle: colors.border.strong,
		},
	},
});
