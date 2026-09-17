import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type CalendarDayColors = { background?: string; foreground: string; range?: string; dot: string };

export type CalendarTokens = {
  day: States<CalendarDayColors, 'pressed' | 'today' | 'selected' | 'inRange' | 'outside' | 'disabled'>;
};

export const calendarTokens = (colors: ThemeColors): CalendarTokens => ({
  day: {
    default: { foreground: colors.content.default, range: colors.feedback.infoSubtle, dot: colors.content.link },
    pressed: { background: colors.background.subtle },
    today: { foreground: colors.content.link },
    selected: { background: colors.content.link, foreground: colors.content.inverse, dot: colors.content.inverse },
    inRange: { foreground: colors.content.default },
    outside: { foreground: colors.content.subtle },
    disabled: { foreground: colors.content.disabled },
  },
});
