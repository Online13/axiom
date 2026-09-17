import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type FloatingButtonColors = { background: string; foreground: string; border?: string };
type FloatingButtonStates = States<FloatingButtonColors, 'pressed' | 'disabled'>;

export type FloatingButtonTokens = {
  solid: FloatingButtonStates;
  tinted: FloatingButtonStates;
};

export const floatingButtonTokens = (colors: ThemeColors): FloatingButtonTokens => ({
  solid: {
    default: { background: colors.background.inverse, foreground: colors.content.inverse },
    pressed: { background: colors.content.muted },
    disabled: { background: colors.border.default, foreground: colors.content.disabled },
  },
  tinted: {
    default: {
      background: colors.background.elevated,
      foreground: colors.content.default,
      border: colors.border.default,
    },
    pressed: { background: colors.background.subtle },
    disabled: { foreground: colors.content.disabled },
  },
});
