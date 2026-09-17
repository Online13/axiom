import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type RadioColors = { border: string; indicator: string };

export type RadioTokens = {
  default: States<RadioColors, 'checked' | 'disabled'>;
};

export const radioTokens = (colors: ThemeColors): RadioTokens => ({
  default: {
    default: { border: colors.border.strong, indicator: colors.content.link },
    checked: { border: colors.content.link },
    disabled: { border: colors.border.subtle, indicator: colors.content.disabled },
  },
});
