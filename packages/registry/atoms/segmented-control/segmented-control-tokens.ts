import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type SegmentedControlColors = { track: string; indicator: string; border: string; foreground: string };

export type SegmentedControlTokens = {
  default: States<SegmentedControlColors, 'selected' | 'disabled'>;
};

export const segmentedControlTokens = (colors: ThemeColors): SegmentedControlTokens => ({
  default: {
    default: {
      track: colors.background.subtle,
      indicator: colors.background.elevated,
      border: colors.border.default,
      foreground: colors.content.muted,
    },
    selected: { foreground: colors.content.default },
    disabled: { foreground: colors.content.disabled },
  },
});
