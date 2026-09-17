import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type SliderColors = { track: string; fill: string; thumb: string };

export type SliderTokens = {
  default: States<SliderColors, 'disabled'>;
};

export const sliderTokens = (colors: ThemeColors): SliderTokens => ({
  default: {
    default: { track: colors.border.default, fill: colors.content.link, thumb: colors.background.elevated },
    disabled: { fill: colors.content.disabled },
  },
});
