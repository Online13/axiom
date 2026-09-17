import { createContext, use } from 'react';
import { Text as NativeText, type TextProps as NativeTextProps } from 'react-native';

import { Slot } from '@/components/core/slot';
import { useTheme, type Theme, type TypographyVariant } from '@/theme';

export type TextVariant = 'bodyLg' | 'body' | 'bodySm' | 'footnote' | 'caption';
export type TextColor =
  | 'default'
  | 'muted'
  | 'subtle'
  | 'disabled'
  | 'inverse'
  | 'link'
  | 'success'
  | 'warning'
  | 'error';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextAlign = 'left' | 'center' | 'right';

export type TextProps = NativeTextProps & {
  variant?: TextVariant;
  color?: TextColor;
  weight?: TextWeight;
  align?: TextAlign;
  asChild?: boolean;
};

export const TEXT_VARIANT_TOKEN: Record<TextVariant, TypographyVariant> = {
  bodyLg: 'body',
  body: 'callout',
  bodySm: 'subheadline',
  footnote: 'footnote',
  caption: 'caption',
};

export const FONT_WEIGHT = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const satisfies Record<TextWeight, string>;

/**
 * Caps on the system text size (Dynamic Type, Android font size), passed as `maxFontSizeMultiplier`.
 * Running text has no cap. `control`: labels of components that grow with their text (buttons, fields, chips).
 * `fixed`: text inside a shape that keeps its size (avatar initials, counters, calendar days, code cells).
 */
export const MAX_FONT_SCALE = {
  control: 1.5,
  fixed: 1.2,
} as const;

export function textColor(colors: Theme['colors'], color: TextColor): string {
  switch (color) {
    case 'success':
    case 'warning':
    case 'error':
      return colors.feedback[color];
    default:
      return colors.content[color];
  }
}

// Set inside a Text, so a nested Text inherits the parent's variant and color unless it sets its own.
const NestedContext = createContext(false);

export function Text({ variant, color, weight, align, asChild, style, children, ...props }: TextProps) {
  const { tokens, colors } = useTheme();
  const nested = use(NestedContext);

  const textStyle = [
    (variant ?? (nested ? undefined : 'body')) && tokens.typography[TEXT_VARIANT_TOKEN[variant ?? 'body']],
    (color ?? (nested ? undefined : 'default')) && { color: textColor(colors, color ?? 'default') },
    weight && { fontWeight: FONT_WEIGHT[weight] },
    align && { textAlign: align },
    style,
  ];

  if (asChild) {
    return (
      <Slot {...props} style={textStyle}>
        {children}
      </Slot>
    );
  }

  return (
    <NestedContext value>
      <NativeText {...props} style={textStyle}>
        {children}
      </NativeText>
    </NestedContext>
  );
}
