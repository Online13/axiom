import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type ToastColors = { background: string; border: string; icon: string };

export type ToastTokens = {
  default: States<ToastColors, 'success' | 'error' | 'info'>;
};

export const toastTokens = (colors: ThemeColors): ToastTokens => ({
  default: {
    default: { background: colors.background.elevated, border: colors.border.subtle, icon: colors.content.default },
    success: { icon: colors.feedback.success },
    error: { icon: colors.feedback.error },
    info: { icon: colors.feedback.info },
  },
});
