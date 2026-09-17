import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Portal } from '@/components/core/portal';
import { Tappable } from '@/components/core/tappable';
import { Icon } from '@/components/ui/icon';
import { FONT_WEIGHT, MAX_FONT_SCALE, Text } from '@/components/ui/text';
import { useTheme } from '@/theme';

import { useSnackbarItem, useSnackbars, type SnackbarData } from '../use-snackbar';

export { snackbar, type SnackbarDismissReason, type SnackbarOptions } from '../use-snackbar';

export type SnackbarHostProps = {
  /** Extra space above the bottom safe area, for a tab bar or a toolbar. */
  bottomOffset?: number;
  swipeToDismiss?: boolean;
};

/** Mount once at the root of the app, next to the PortalHost. */
export function SnackbarHost({ bottomOffset = 0, swipeToDismiss = true }: SnackbarHostProps) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const items = useSnackbars();

  if (items.length === 0) return null;

  return (
    <Portal>
      <View
        style={[
          styles.container,
          {
            // Clear of the Android gesture bar, so a swipe on the snackbar doesn't start the system back or home gesture.
            bottom: insets.bottom + tokens.spacing[4] + bottomOffset,
            left: tokens.metrics.screenMargin,
            right: tokens.metrics.screenMargin,
          },
        ]}
      >
        {items.map((item) => (
          <SnackbarView key={item.id} data={item} swipeToDismiss={swipeToDismiss} />
        ))}
      </View>
    </Portal>
  );
}

function SnackbarView({ data, swipeToDismiss }: { data: SnackbarData; swipeToDismiss: boolean }) {
  const { tokens, components } = useTheme();
  const { gesture, animatedStyle, onAction } = useSnackbarItem(data, swipeToDismiss);
  const colors = components.snackbar.default.default;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        accessibilityLiveRegion="polite"
        style={[
          styles.snackbar,
          {
            minHeight: 48,
            gap: tokens.spacing[3],
            paddingStart: tokens.spacing[4],
            paddingEnd: data.action ? tokens.spacing[1] : tokens.spacing[4],
            paddingVertical: tokens.spacing[1],
            borderRadius: tokens.radius.md,
            backgroundColor: colors.background,
          },
          !data.open && styles.leaving,
          animatedStyle,
        ]}
      >
        {data.icon ? <Icon name={data.icon} color={colors.foreground} /> : null}
        <Text variant="bodySm" numberOfLines={2} style={[styles.message, { color: colors.foreground }]}>
          {data.message}
        </Text>
        {data.action ? (
          <Tappable
            onPress={onAction}
            style={({ pressed }) => [
              styles.action,
              { paddingHorizontal: tokens.spacing[3], borderRadius: tokens.radius.sm, opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text variant="bodySm" maxFontSizeMultiplier={MAX_FONT_SCALE.control} style={{ color: colors.action, fontWeight: FONT_WEIGHT.semibold }}>
              {data.action.label}
            </Text>
          </Tappable>
        ) : null}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    pointerEvents: 'box-none',
  },
  snackbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 6px 24px hsla(0, 0%, 0%, 0.18)',
  },
  leaving: {
    pointerEvents: 'none',
  },
  message: {
    flex: 1,
    paddingVertical: 6,
  },
  action: {
    minHeight: 40,
    justifyContent: 'center',
  },
});
