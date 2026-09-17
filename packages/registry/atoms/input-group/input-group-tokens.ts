import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type InputGroupColors = { addon?: string; divider: string };

// The group border, text and placeholder come from the `input` tokens.
export type InputGroupTokens = {
  default: States<InputGroupColors, 'disabled'>;
};

export const inputGroupTokens = (colors: ThemeColors): InputGroupTokens => ({
  default: {
    default: { addon: colors.background.subtle, divider: colors.border.default },
    disabled: { divider: colors.border.subtle },
  },
});
