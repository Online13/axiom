import type { ReactNode } from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Tappable } from '@/components/core/tappable';
import { Text } from '@/components/ui/text';
import { Title } from '@/components/ui/title';
import { useTheme, type Radius, type Spacing } from '@/theme';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export type CardProps = {
  variant?: CardVariant;
  /** Inner padding for a card without sub-components. The sub-components pad themselves. */
  padding?: keyof Spacing | 'none';
  radius?: keyof Radius;
  /** Makes the whole card pressable. Buttons inside still receive their own presses. */
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function CardRoot({
  variant = 'elevated',
  padding = 'none',
  radius = 'lg',
  onPress,
  disabled = false,
  accessibilityLabel,
  children,
  style,
}: CardProps) {
  const { tokens, components } = useTheme();
  const states = components.card[variant];

  const containerStyle = (pressed: boolean): StyleProp<ViewStyle> => {
    const colors = { ...states.default, ...(pressed ? states.pressed : undefined) };
    return [
      styles.card,
      {
        borderRadius: tokens.radius[radius],
        backgroundColor: colors.background,
        borderWidth: colors.border ? tokens.metrics.hairline : 0,
        borderColor: colors.border,
        // The sub-components pad their top; the card pads the bottom of the last one.
        paddingBottom: padding === 'none' ? tokens.spacing[4] : undefined,
        padding: padding === 'none' ? undefined : tokens.spacing[padding],
      },
      variant === 'elevated' && styles.shadow,
      disabled && styles.disabled,
      style,
    ];
  };

  if (onPress) {
    return (
      <Tappable
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => containerStyle(pressed)}
      >
        {children}
      </Tappable>
    );
  }

  return (
    <View accessibilityLabel={accessibilityLabel} style={containerStyle(false)}>
      {children}
    </View>
  );
}

export type CardMediaProps = {
  source: ImageSourcePropType;
  aspectRatio?: number;
  /** Overlay content on the image, like a Badge. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function CardMedia({ source, aspectRatio = 16 / 9, children, style }: CardMediaProps) {
  const { tokens } = useTheme();

  return (
    <View style={[{ aspectRatio }, style]}>
      <Image source={source} style={StyleSheet.absoluteFill} resizeMode="cover" />
      {children ? <View style={[styles.mediaOverlay, { padding: tokens.spacing[3] }]}>{children}</View> : null}
    </View>
  );
}

type PartProps = { children?: ReactNode; style?: StyleProp<ViewStyle> };

function usePartStyle() {
  const { tokens } = useTheme();
  return { paddingHorizontal: tokens.spacing[4], paddingTop: tokens.spacing[4] };
}

function CardHeader({ children, style }: PartProps) {
  const { tokens } = useTheme();
  return <View style={[usePartStyle(), { gap: tokens.spacing[1] }, style]}>{children}</View>;
}

function CardTitle({ children }: { children?: ReactNode }) {
  return <Title variant="subheading">{children}</Title>;
}

function CardDescription({ children }: { children?: ReactNode }) {
  return (
    <Text variant="bodySm" color="muted">
      {children}
    </Text>
  );
}

function CardContent({ children, style }: PartProps) {
  return <View style={[usePartStyle(), style]}>{children}</View>;
}

function CardFooter({ children, style }: PartProps) {
  const { tokens } = useTheme();
  return <View style={[usePartStyle(), styles.footer, { gap: tokens.spacing[2] }, style]}>{children}</View>;
}

export const Card = Object.assign(CardRoot, {
  Media: CardMedia,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  shadow: {
    boxShadow: '0px 1px 3px hsla(0, 0%, 0%, 0.08), 0px 4px 12px hsla(0, 0%, 0%, 0.06)',
  },
  disabled: {
    opacity: 0.5,
  },
  mediaOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});
