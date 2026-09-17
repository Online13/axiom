import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type AlertColors = { background: string; icon: string; border?: string };
type AlertStates = States<AlertColors, never>;

export type AlertTokens = {
  info: AlertStates;
  success: AlertStates;
  warning: AlertStates;
  error: AlertStates;
  neutral: AlertStates;
};

export const alertTokens = (colors: ThemeColors): AlertTokens => ({
  info: {
    default: { background: colors.feedback.infoSubtle, icon: colors.feedback.info },
  },
  success: {
    default: { background: colors.feedback.successSubtle, icon: colors.feedback.success },
  },
  warning: {
    default: { background: colors.feedback.warningSubtle, icon: colors.feedback.warning },
  },
  error: {
    default: { background: colors.feedback.errorSubtle, icon: colors.feedback.error },
  },
  neutral: {
    default: { background: colors.background.subtle, icon: colors.content.muted, border: colors.border.subtle },
  },
});
