import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type DialogColors = { background: string };

export type DialogTokens = {
  default: States<DialogColors, never>;
};

export const dialogTokens = (colors: ThemeColors): DialogTokens => ({
  default: {
    default: { background: colors.background.elevated },
  },
});
