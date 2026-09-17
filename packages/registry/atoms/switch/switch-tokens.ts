import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type SwitchColors = { track: string; thumb: string };

export type SwitchTokens = {
  default: States<SwitchColors, 'checked' | 'disabled'>;
};

export const switchTokens = (colors: ThemeColors): SwitchTokens => ({
  default: {
    default: { track: colors.border.default, thumb: colors.background.elevated },
    checked: { track: colors.feedback.success },
    disabled: { track: colors.border.subtle },
  },
});
