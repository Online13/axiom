import { Text as NativeText, type TextProps as NativeTextProps } from 'react-native';

import { Slot } from '@/components/core/slot';
import { useTheme, type TypographyVariant } from '@/theme';

export type TitleVariant = 'display' | 'headingLg' | 'heading' | 'headingSm' | 'subheading';
export type TitleColor = 'default' | 'muted' | 'inverse';

export type TitleProps = NativeTextProps & {
  variant?: TitleVariant;
  color?: TitleColor;
  align?: 'left' | 'center' | 'right';
  asChild?: boolean;
};

const VARIANT_TOKEN: Record<TitleVariant, TypographyVariant> = {
  display: 'largeTitle',
  headingLg: 'title1',
  heading: 'title2',
  headingSm: 'title3',
  subheading: 'headline',
};

export function Title({
  variant = 'heading',
  color = 'default',
  align,
  asChild,
  accessibilityRole = 'header',
  style,
  children,
  ...props
}: TitleProps) {
  const { tokens, colors } = useTheme();

  const titleStyle = [
    tokens.typography[VARIANT_TOKEN[variant]],
    { color: colors.content[color] },
    align && { textAlign: align },
    style,
  ];

  if (asChild) {
    return (
      <Slot {...props} accessibilityRole={accessibilityRole} style={titleStyle}>
        {children}
      </Slot>
    );
  }

  return (
    <NativeText {...props} accessibilityRole={accessibilityRole} style={titleStyle}>
      {children}
    </NativeText>
  );
}
