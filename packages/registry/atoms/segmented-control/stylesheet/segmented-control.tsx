import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { Tappable } from '@/components/core/tappable';
import { Icon } from '@/components/ui/icon';
import { FONT_WEIGHT, Text } from '@/components/ui/text';
import { useTheme } from '@/theme';

import { useSegmentedControl, type UseSegmentedControlOptions } from '../use-segmented-control';

export type { SegmentOption } from '../use-segmented-control';

export type SegmentedControlProps = UseSegmentedControlOptions & {
  /** Height: 32 or 40pt. */
  size?: 'md' | 'lg';
  /** Stretches to the parent width with equal segments. `false` sizes it to its content. */
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

const INSET = 2;

export function SegmentedControl({ size = 'md', fullWidth = true, disabled = false, style, ...options }: SegmentedControlProps) {
  const { tokens, components } = useTheme();
  const { segments, selected, selectIndex, onTrackLayout, onSegmentLayout, gesture, indicatorStyle } =
    useSegmentedControl({ ...options, disabled, fullWidth, inset: INSET });

  const states = components.segmentedControl.default;
  const height = size === 'md' ? tokens.sizes.control.sm : tokens.spacing[10];
  const radius = tokens.radius.md;

  return (
    <GestureDetector gesture={gesture}>
      <View
        accessibilityRole="tablist"
        onLayout={onTrackLayout}
        style={[
          styles.track,
          {
            height,
            padding: INSET,
            borderRadius: radius,
            backgroundColor: states.default.track,
          },
          !fullWidth && styles.hug,
          style,
        ]}
      >
        <Animated.View
          style={[
            styles.indicator,
            {
              top: INSET,
              bottom: INSET,
              borderRadius: radius - INSET,
              borderWidth: tokens.metrics.hairline,
              borderColor: states.default.border,
              backgroundColor: states.default.indicator,
            },
            indicatorStyle,
          ]}
        />
        {segments.map((segment, index) => {
          const isSelected = segment.value === selected;
          const isDisabled = disabled || segment.disabled === true;
          const foreground = isDisabled
            ? { ...states.default, ...states.disabled }.foreground
            : isSelected
              ? { ...states.default, ...states.selected }.foreground
              : states.default.foreground;

          return (
            <Tappable
              key={segment.value}
              minTouchTarget={false}
              disabled={isDisabled}
              accessibilityRole="tab"
              accessibilityLabel={segment.accessibilityLabel ?? segment.label}
              accessibilityState={{ selected: isSelected }}
              onLayout={onSegmentLayout(index)}
              onPress={() => selectIndex(index)}
              style={[
                styles.segment,
                { gap: tokens.spacing[1], paddingHorizontal: tokens.spacing[3] },
                fullWidth && styles.equal,
              ]}
            >
              {segment.icon ? <Icon name={segment.icon} size="sm" color={foreground} /> : null}
              {segment.label ? (
                <Text
                  variant="bodySm"
                  numberOfLines={1}
                  style={{ color: foreground, fontWeight: isSelected ? FONT_WEIGHT.semibold : FONT_WEIGHT.medium }}
                >
                  {segment.label}
                </Text>
              ) : null}
            </Tappable>
          );
        })}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
  },
  hug: {
    alignSelf: 'flex-start',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    pointerEvents: 'none',
    boxShadow: '0px 1px 3px hsla(0, 0%, 0%, 0.12)',
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  equal: {
    flex: 1,
    flexBasis: 0,
  },
});
