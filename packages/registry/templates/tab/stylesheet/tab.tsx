import { Children, createContext, isValidElement, use, type ReactElement, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { Tappable } from '@/components/core/tappable';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/components/ui/icons';
import { MAX_FONT_SCALE, Text } from '@/components/ui/text';
import { useTheme } from '@/theme';

import { useTab } from '../use-tab';

export type TabVariant = 'underline' | 'pill';

type TabContextValue = ReturnType<typeof useTab> & {
  variant: TabVariant;
  scrollable: boolean;
};

const TabContext = createContext<TabContextValue | null>(null);

function useTabContext() {
  const context = use(TabContext);
  if (!context) throw new Error('Tab.Item must be used inside <Tab>.');
  return context;
}

export type TabProps = {
  /** Value of the selected tab. */
  value?: string;
  defaultValue?: string;
  /** Called after an enabled tab is pressed. Swap nearby content, don't push a screen. */
  onValueChange?: (value: string) => void;
  /** An indicator under the label, or a filled capsule behind it. */
  variant?: TabVariant;
  /** Items keep their natural width and scroll horizontally. */
  scrollable?: boolean;
  /** A horizontal drag across the panels also switches tab. Needs `Tab.Panel` children. */
  swipeEnabled?: boolean;
  /** Two or more `Tab.Item` elements, and one `Tab.Panel` per item when the tabs own their content. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const INDICATOR_HEIGHT = 2;

function TabRoot({
  value,
  defaultValue,
  onValueChange,
  variant = 'underline',
  scrollable = false,
  swipeEnabled = false,
  children,
  style,
}: TabProps) {
  const { tokens, components } = useTheme();

  // Items give the order of the list; panels are matched to them by value.
  const items: ReactElement<TabItemProps>[] = [];
  const panels = new Map<string, ReactElement<TabPanelProps>>();
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === TabPanel) {
      const panel = child as ReactElement<TabPanelProps>;
      panels.set(panel.props.value, panel);
    } else {
      items.push(child as ReactElement<TabItemProps>);
    }
  });
  const values = items.map((item) => item.props.value);
  // Nothing to swipe across without panels.
  const swipeable = swipeEnabled && panels.size > 1;

  const tab = useTab({ value, defaultValue, onValueChange, values, swipeEnabled: swipeable, scrollable });
  const colors = components.tab[variant].default;

  const pill = variant === 'pill';
  const list = (
    <View
      accessibilityRole="tablist"
      style={[
        styles.list,
        // Stretch, never `flex: 1`: in a column parent that would give the row a height of 0.
        !scrollable && styles.stretch,
        {
          padding: pill ? tokens.spacing[1] : 0,
          borderRadius: pill ? tokens.radius.full : 0,
          backgroundColor: colors.background,
          borderBottomWidth: pill ? 0 : StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* The indicator sits under the items and slides between them. */}
      <Animated.View
        pointerEvents="none"
        style={[
          pill ? styles.pillIndicator : styles.underline,
          {
            backgroundColor: colors.indicator,
            borderRadius: pill ? tokens.radius.full : 0,
            height: pill ? undefined : INDICATOR_HEIGHT,
          },
          tab.indicatorStyle,
        ]}
      />
      {items}
    </View>
  );

  const row = scrollable ? (
    <Animated.ScrollView
      ref={tab.listRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroller}
      onLayout={tab.onListLayout}
      onContentSizeChange={tab.onListContentSizeChange}
      style={[styles.row, style]}
    >
      {list}
    </Animated.ScrollView>
  ) : (
    <View style={style}>{list}</View>
  );

  const selected = panels.get(tab.value);

  return (
    <TabContext value={{ ...tab, variant, scrollable }}>
      {panels.size === 0 ? (
        row
      ) : (
        <View style={styles.root}>
          {row}
          {swipeable ? (
            <GestureDetector gesture={tab.gesture}>
              <View style={styles.pager} onLayout={tab.onPagerLayout}>
                <Animated.View style={[styles.pages, tab.pagesStyle]}>
                  {values.map((item) => (
                    <View
                      key={item}
                      // Off-screen panels are there for the finger, not for the screen reader.
                      accessibilityElementsHidden={item !== tab.value}
                      importantForAccessibility={item === tab.value ? 'auto' : 'no-hide-descendants'}
                      style={{ width: tab.pageWidth }}
                    >
                      {tab.isMounted(item) ? panels.get(item) : null}
                    </View>
                  ))}
                </Animated.View>
              </View>
            </GestureDetector>
          ) : (
            selected
          )}
        </View>
      )}
    </TabContext>
  );
}

export type TabItemProps = {
  /** Stable identifier returned through `onValueChange`. */
  value: string;
  /** Short label. One or two words scan best. */
  children?: ReactNode;
  /** An icon before the label. */
  icon?: IconName | ReactNode;
  /** Count, short status or dot next to the label. */
  badge?: number | string | boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

function TabItem({ value, children, icon, badge, disabled = false, accessibilityLabel, style }: TabItemProps) {
  const { tokens, components } = useTheme();
  const tab = useTabContext();
  const states = components.tab[tab.variant];

  const selected = tab.value === value;
  const colors = { ...states.default, ...(disabled ? states.disabled : selected ? states.selected : undefined) };

  return (
    <Tappable
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onLayout={tab.onItemLayout(value)}
      onPress={() => tab.select(value)}
      style={[
        styles.item,
        !tab.scrollable && styles.fill,
        {
          minHeight: tokens.metrics.touchTarget,
          paddingHorizontal: tokens.spacing[3],
          gap: tokens.spacing[1],
        },
        style,
      ]}
    >
      {icon !== undefined ? (
        isValidElement(icon) ? (
          icon
        ) : (
          <Icon name={icon as IconName} size="sm" color={colors.content} />
        )
      ) : null}
      <Text
        variant="bodySm"
        weight={selected ? 'semibold' : 'regular'}
        maxFontSizeMultiplier={MAX_FONT_SCALE.control}
        numberOfLines={1}
        style={{ color: colors.content }}
      >
        {children}
      </Text>
      {badge !== undefined && badge !== false && badge !== 0 ? (
        badge === true ? (
          <Badge dot />
        ) : typeof badge === 'number' ? (
          <Badge count={badge} size="sm" />
        ) : (
          <Badge size="sm">{badge}</Badge>
        )
      ) : null}
    </Tappable>
  );
}

export type TabPanelProps = {
  /** Value of the `Tab.Item` this panel belongs to. */
  value: string;
  /** Content shown while that tab is selected. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** The content of one tab. `Tab` decides which panels are rendered; this only fills the space left. */
function TabPanel({ children, style }: TabPanelProps) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

export const Tab = Object.assign(TabRoot, {
  Item: TabItem,
  Panel: TabPanel,
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  fill: {
    flex: 1,
  },
  stretch: {
    alignSelf: 'stretch',
  },
  row: {
    flexGrow: 0,
  },
  scroller: {
    flexGrow: 1,
  },
  pager: {
    flex: 1,
    overflow: 'hidden',
  },
  pages: {
    flex: 1,
    flexDirection: 'row',
  },
  panel: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    start: 0,
  },
  pillIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    start: 0,
  },
});
