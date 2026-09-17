import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type ItemColors = { background?: string; divider: string };

export type ItemTokens = {
  default: States<ItemColors, 'pressed' | 'selected'>;
};

export const itemTokens = (colors: ThemeColors): ItemTokens => ({
  default: {
    default: { divider: colors.border.default },
    pressed: { background: colors.background.subtle },
    selected: { background: colors.feedback.infoSubtle },
  },
});
