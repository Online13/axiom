import type { ThemeColors } from "@/theme/colors";
import type { Tokens } from "@/theme/tokens";
import type { States } from "@/theme/components/states";

type SkeletonColors = { background: string; highlight: string };

export type SkeletonTokens = {
	default: States<SkeletonColors, never>;
};

export const skeletonTokens = (
	colors: ThemeColors,
	tokens: Tokens,
): SkeletonTokens => ({
	default: {
		default: {
			background: colors.border.subtle,
			highlight: colors.border.default,
		},
	},
});
