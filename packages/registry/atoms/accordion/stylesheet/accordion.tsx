import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { Tappable } from '@/components/core/tappable';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme';

import {
  AccordionContext,
  AccordionItemContext,
  useAccordion,
  useAccordionContent,
  useAccordionContext,
  useAccordionIndicator,
  useAccordionItem,
  type UseAccordionOptions,
} from '../use-accordion';

export type AccordionProps = UseAccordionOptions & {
  /** Hairline between sections. */
  divider?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function AccordionRoot({ divider = true, children, style, ...options }: AccordionProps) {
  const { tokens, colors } = useTheme();
  const accordion = useAccordion(options);
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <AccordionContext value={accordion}>
      <View style={style}>
        {items.map((item, i) => (
          <Fragment key={item.key ?? i}>
            {divider && i > 0 ? (
              <View style={{ height: tokens.metrics.hairline, backgroundColor: colors.border.default }} />
            ) : null}
            {item}
          </Fragment>
        ))}
      </View>
    </AccordionContext>
  );
}

export type AccordionItemProps = {
  value: string;
  disabled?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function AccordionItem({ value, disabled = false, children, style }: AccordionItemProps) {
  const accordion = useAccordionContext();
  const inactive = disabled || accordion.disabled;

  return (
    <AccordionItemContext
      value={{ value, open: !inactive && accordion.isOpen(value), disabled: inactive, toggle: () => accordion.toggle(value) }}
    >
      <View style={style}>{children}</View>
    </AccordionItemContext>
  );
}

export type AccordionTriggerProps = {
  children?: ReactNode;
  /** Indicator on the right, rotated when open. `null` hides it. */
  icon?: ReactNode | null;
  leading?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function AccordionTrigger({ children, icon, leading, style }: AccordionTriggerProps) {
  const { tokens } = useTheme();
  const { open, disabled, toggle } = useAccordionItem();
  const indicatorStyle = useAccordionIndicator(open);

  return (
    <Tappable
      disabled={disabled}
      accessibilityState={{ expanded: open }}
      onPress={toggle}
      style={({ pressed }) => [
        styles.trigger,
        {
          minHeight: tokens.metrics.touchTarget + tokens.spacing[2],
          gap: tokens.spacing[3],
          paddingVertical: tokens.spacing[3],
          opacity: pressed ? 0.6 : 1,
        },
        style,
      ]}
    >
      {leading}
      <View style={styles.title}>
        {typeof children === 'string' ? (
          <Text weight="medium" color={disabled ? 'disabled' : 'default'}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
      {icon === null ? null : (
        <Animated.View style={indicatorStyle}>
          {icon ?? <Icon name="chevron-down" size="sm" color={disabled ? 'disabled' : 'muted'} />}
        </Animated.View>
      )}
    </Tappable>
  );
}

export type AccordionContentProps = {
  children?: ReactNode;
  /** Keeps the content mounted while closed, to preserve its state. */
  forceMount?: boolean;
  style?: StyleProp<ViewStyle>;
};

function AccordionContent({ children, forceMount = false, style }: AccordionContentProps) {
  const { tokens } = useTheme();
  const { open } = useAccordionItem();
  const content = useAccordionContent(open, forceMount);

  if (!content.rendered) return null;

  return (
    <Animated.View
      accessibilityElementsHidden={!open}
      importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}
      style={[styles.clip, content.containerStyle]}
    >
      {/* Absolute, so it keeps its natural height while the container animates. */}
      <View onLayout={content.onLayout} style={[styles.measure, { paddingBottom: tokens.spacing[4] }, style]}>
        {typeof children === 'string' ? (
          <Text variant="bodySm" color="muted">
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Animated.View>
  );
}

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  clip: {
    overflow: 'hidden',
  },
  measure: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
