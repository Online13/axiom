import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type ChipColors = { background?: string; foreground: string; border?: string };
type ChipStates = States<ChipColors, 'pressed' | 'selected' | 'disabled'>;

export type ChipTokens = {
  outline: ChipStates;
  filled: ChipStates;
};

export const chipTokens = (colors: ThemeColors): ChipTokens => ({
  outline: {
    default: { background: colors.background.default, foreground: colors.content.default, border: colors.border.default },
    pressed: { background: colors.background.subtle },
    selected: { background: colors.background.inverse, foreground: colors.content.inverse, border: colors.background.inverse },
    disabled: { foreground: colors.content.disabled, border: colors.border.subtle },
  },
  filled: {
    default: { background: colors.background.subtle, foreground: colors.content.default },
    pressed: { background: colors.border.default },
    selected: { background: colors.background.inverse, foreground: colors.content.inverse },
    disabled: { foreground: colors.content.disabled },
  },
});
