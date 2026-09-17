import type { ThemeColors } from '@/theme/colors';
import type { States } from '@/theme/components';

type InputColors = {
  background?: string;
  border?: string;
  text: string;
  placeholder: string;
  /** Prefix, suffix and addon text. */
  affix: string;
  caret: string;
};
type InputStates = States<InputColors, 'focused' | 'invalid' | 'disabled'>;

export type InputTokens = {
  outline: InputStates;
  filled: InputStates;
};

export const inputTokens = (colors: ThemeColors): InputTokens => ({
  outline: {
    default: {
      background: colors.background.default,
      border: colors.border.default,
      text: colors.content.default,
      placeholder: colors.content.subtle,
      affix: colors.content.muted,
      caret: colors.content.link,
    },
    focused: { border: colors.border.focus },
    invalid: { border: colors.feedback.error, caret: colors.feedback.error },
    disabled: {
      background: colors.background.subtle,
      border: colors.border.subtle,
      text: colors.content.disabled,
      affix: colors.content.disabled,
    },
  },
  filled: {
    default: {
      background: colors.background.subtle,
      text: colors.content.default,
      placeholder: colors.content.subtle,
      affix: colors.content.muted,
      caret: colors.content.link,
    },
    focused: { border: colors.border.focus },
    invalid: { border: colors.feedback.error, caret: colors.feedback.error },
    disabled: { text: colors.content.disabled, affix: colors.content.disabled },
  },
});
