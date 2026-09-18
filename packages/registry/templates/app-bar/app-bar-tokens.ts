import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type AppBarColors = {
  background: string;
  border: string;
  /** The compact title, centered in the bar. */
  title: string;
  /** The large title on its own row. */
  largeTitle: string;
};

export type AppBarTokens = {
  default: States<AppBarColors, never>;
};

export const appBarTokens = (colors: ThemeColors): AppBarTokens => ({
  default: {
    default: {
      background: colors.background.default,
      border: colors.border.subtle,
      title: colors.content.default,
      largeTitle: colors.content.default,
    },
  },
});
