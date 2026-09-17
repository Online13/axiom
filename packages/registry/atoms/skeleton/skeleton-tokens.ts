import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type SkeletonColors = { background: string; highlight: string };

export type SkeletonTokens = {
  default: States<SkeletonColors, never>;
};

export const skeletonTokens = (colors: ThemeColors): SkeletonTokens => ({
  default: {
    default: { background: colors.border.subtle, highlight: colors.border.default },
  },
});
