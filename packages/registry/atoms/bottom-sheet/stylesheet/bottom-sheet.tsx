import { useEffect, type ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type FlatListProps,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Overlay } from '@/components/core/overlay';
import { Portal } from '@/components/core/portal';
import { useTheme } from '@/theme';
import { Title } from '@/components/ui/title';

import { BottomSheetRoot, BottomSheetTrigger } from '../bottom-sheet-root';
import {
  BottomSheetContentContext,
  useBottomSheetContent,
  useBottomSheetContentContext,
  type UseBottomSheetContentOptions,
} from '../use-bottom-sheet';

export type BottomSheetContentProps = Omit<UseBottomSheetContentOptions, 'bottomOffset'> & {
  /** Dims the screen behind the sheet. The dimming follows the sheet position. */
  overlay?: boolean;
  /** Floats above the bottom edge with all corners rounded. */
  detached?: boolean;
  /** Floating actions pinned above the bottom safe area, visible at every snap point. */
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

function BottomSheetContent({
  overlay = true,
  detached = false,
  footer,
  style,
  children,
  ...options
}: BottomSheetContentProps) {
  const { tokens, components } = useTheme();
  const insets = useSafeAreaInsets();
  const margin = tokens.metrics.screenMargin;
  const bottomOffset = detached ? insets.bottom + tokens.spacing[2] : 0;

  const sheet = useBottomSheetContent({ ...options, bottomOffset });
  if (!sheet.mounted) return null;

  const colors = components.bottomSheet.default.default;
  const safeBottom = detached ? tokens.spacing[3] : insets.bottom;

  return (
    <Portal>
      <View style={styles.layer}>
        {overlay ? (
          <Overlay
            visible={sheet.open}
            progress={sheet.progress}
            onPress={sheet.dismissible ? sheet.close : undefined}
          />
        ) : null}
        <GestureDetector gesture={sheet.gesture}>
          <Animated.View
            accessibilityViewIsModal
            style={[
              styles.sheet,
              {
                height: sheet.sheetHeight,
                bottom: bottomOffset,
                backgroundColor: colors.background,
                borderTopLeftRadius: tokens.radius.xl,
                borderTopRightRadius: tokens.radius.xl,
              },
              detached && { left: margin, right: margin, borderRadius: tokens.radius.xl },
              style,
              sheet.sheetStyle,
            ]}
          >
            <BottomSheetContentContext value={sheet.context}>
              <View
                onLayout={sheet.onContentLayout}
                style={[
                  !sheet.fitsContent && styles.fill,
                  { paddingBottom: footer ? sheet.footerHeight : safeBottom },
                ]}
              >
                {children}
              </View>
              {footer ? (
                <Animated.View
                  onLayout={sheet.onFooterLayout}
                  style={[
                    styles.footer,
                    {
                      gap: tokens.spacing[2],
                      paddingHorizontal: margin,
                      paddingTop: tokens.spacing[2],
                      paddingBottom: safeBottom + tokens.spacing[2],
                      backgroundColor: colors.background,
                    },
                    sheet.footerStyle,
                  ]}
                >
                  {footer}
                </Animated.View>
              ) : null}
            </BottomSheetContentContext>
          </Animated.View>
        </GestureDetector>
      </View>
    </Portal>
  );
}

function BottomSheetHandle({ style }: { style?: StyleProp<ViewStyle> }) {
  const { tokens, components } = useTheme();
  const { index, snapCount, requestIndex } = useBottomSheetContentContext();

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Resize sheet"
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment') requestIndex(Math.min(index + 1, snapCount - 1));
        if (event.nativeEvent.actionName === 'decrement') requestIndex(Math.max(index - 1, 0));
      }}
      style={[styles.handleArea, { paddingVertical: tokens.spacing[2] }, style]}
    >
      <View
        style={[
          styles.handle,
          { borderRadius: tokens.radius.full, backgroundColor: components.bottomSheet.default.default.handle },
        ]}
      />
    </View>
  );
}

export type BottomSheetHeaderProps = {
  title?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function BottomSheetHeader({ title, leading, trailing, style }: BottomSheetHeaderProps) {
  const { tokens } = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          minHeight: tokens.metrics.touchTarget,
          paddingHorizontal: tokens.metrics.screenMargin,
          gap: tokens.spacing[2],
        },
        style,
      ]}
    >
      <View style={[styles.side, styles.start]}>{leading}</View>
      {title ? (
        <Title variant="subheading" align="center" numberOfLines={1} style={styles.title}>
          {title}
        </Title>
      ) : null}
      <View style={[styles.side, styles.end]}>{trailing}</View>
    </View>
  );
}

/** Scrollable content that hands the gesture back to the sheet when scrolled to the top. */
function BottomSheetScrollView(props: ScrollViewProps) {
  const { nativeGesture, scrollRef, scrollHandler, registerScroll } = useBottomSheetContentContext();
  useEffect(registerScroll, [registerScroll]);

  return (
    <GestureDetector gesture={nativeGesture}>
      <Animated.ScrollView
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        {...props}
        ref={scrollRef}
        onScroll={scrollHandler}
      />
    </GestureDetector>
  );
}

// `CellRendererComponent` isn't supported by Reanimated's FlatList.
function BottomSheetFlatList<T>(props: Omit<FlatListProps<T>, 'CellRendererComponent'>) {
  const { nativeGesture, scrollRef, scrollHandler, registerScroll } = useBottomSheetContentContext();
  useEffect(registerScroll, [registerScroll]);

  return (
    <GestureDetector gesture={nativeGesture}>
      <Animated.FlatList
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        {...(props as Omit<FlatListProps<unknown>, 'CellRendererComponent'>)}
        // The sheet scrolls the list through the same ref as a ScrollView.
        ref={scrollRef as never}
        onScroll={scrollHandler}
      />
    </GestureDetector>
  );
}

export const BottomSheet = {
  Root: BottomSheetRoot,
  Trigger: BottomSheetTrigger,
  Content: BottomSheetContent,
  Handle: BottomSheetHandle,
  Header: BottomSheetHeader,
  ScrollView: BottomSheetScrollView,
  FlatList: BottomSheetFlatList,
};

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'box-none',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  handleArea: {
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    flex: 1,
    flexDirection: 'row',
  },
  start: {
    justifyContent: 'flex-start',
  },
  end: {
    justifyContent: 'flex-end',
  },
  title: {
    flexShrink: 1,
  },
});
