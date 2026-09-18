import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Tappable } from '@/components/core/tappable';
import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/components/ui/icons';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme';

import { ExperienceScreen, Note, fakeRows } from './shared';

const ACTION_WIDTH = 80;
// Half an action open is enough to commit, and a fast flick counts as much as the distance.
const OPEN_RATIO = 0.5;
const FLICK_VELOCITY = 600;

type SwipeRowProps = {
  title: string;
  subtitle: string;
  openId: number | null;
  id: number;
  onOpen: (id: number | null) => void;
  onAction: (label: string) => void;
};

/** One row over its actions: the row slides, the buttons underneath stay put. */
function SwipeRow({ title, subtitle, id, openId, onOpen, onAction }: SwipeRowProps) {
  const { tokens, colors } = useTheme();
  const translate = useSharedValue(0);
  // The gesture starts from where the row already sits, so a second drag continues it.
  const start = useSharedValue(0);

  // Two actions on the left of the finger's travel, one on the right.
  const rightWidth = ACTION_WIDTH * 2;
  const leftWidth = ACTION_WIDTH;

  const close = () => {
    translate.value = withSpring(0, { damping: 20 });
    onOpen(null);
  };

  // A row opened elsewhere closes this one.
  useEffect(() => {
    if (openId !== null && openId !== id) translate.value = withSpring(0, { damping: 20 });
  }, [id, openId, translate]);

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-12, 12])
    .onBegin(() => {
      start.value = translate.value;
    })
    .onUpdate((event) => {
      const next = start.value + event.translationX;
      translate.value = Math.max(Math.min(next, leftWidth), -rightWidth);
    })
    .onEnd((event) => {
      const goingLeft = translate.value < 0;
      const width = goingLeft ? rightWidth : leftWidth;
      const past = Math.abs(translate.value) > width * OPEN_RATIO;
      const flick = Math.abs(event.velocityX) > FLICK_VELOCITY && (goingLeft ? event.velocityX < 0 : event.velocityX > 0);
      const open = past || flick;

      translate.value = withSpring(open ? (goingLeft ? -rightWidth : leftWidth) : 0, { damping: 20 });
      scheduleOnRN(onOpen, open ? id : null);
    });

  const rowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translate.value }] }));

  const act = (label: string) => {
    onAction(label);
    close();
  };

  return (
    <View style={styles.rowContainer}>
      <View style={styles.actions}>
        <Action icon="check" label="Read" tone={colors.feedback.info} onPress={() => act('Read')} />
        <View style={styles.spacer} />
        <Action icon="favorite" label="Flag" tone={colors.feedback.warning} onPress={() => act('Flag')} />
        <Action icon="file" label="Archive" tone={colors.feedback.success} onPress={() => act('Archive')} />
      </View>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.row,
            {
              paddingHorizontal: tokens.metrics.screenMargin,
              paddingVertical: tokens.spacing[3],
              backgroundColor: colors.background.elevated,
              borderBottomWidth: tokens.metrics.hairline,
              borderBottomColor: colors.border.subtle,
            },
            rowStyle,
          ]}
        >
          <Text weight="medium">{title}</Text>
          <Text variant="bodySm" color="muted">
            {subtitle}
          </Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

function Action({
  icon,
  label,
  tone,
  onPress,
}: {
  icon: IconName;
  label: string;
  tone: string;
  onPress: () => void;
}) {
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.action, { backgroundColor: tone }]}
    >
      <Icon name={icon} size="sm" color="inverse" />
      <Text variant="caption" color="inverse">
        {label}
      </Text>
    </Tappable>
  );
}

export default function SwipeActionsScreen() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [log, setLog] = useState('Drag a row left for Flag and Archive, right for Read.');
  const rows = fakeRows(8);

  return (
    <ExperienceScreen>
      <Note>{log}</Note>
      <ScrollView>
        {rows.map((row) => (
          <SwipeRow
            key={row.id}
            id={row.id}
            title={row.title}
            subtitle={row.subtitle}
            openId={openId}
            onOpen={setOpenId}
            onAction={(label) => setLog(`${label} on “${row.title}”`)}
          />
        ))}
      </ScrollView>
    </ExperienceScreen>
  );
}

const styles = StyleSheet.create({
  rowContainer: { overflow: 'hidden' },
  actions: { ...StyleSheet.absoluteFill, flexDirection: 'row' },
  spacer: { flex: 1 },
  action: { width: ACTION_WIDTH, alignItems: 'center', justifyContent: 'center', gap: 4 },
  row: { justifyContent: 'center', gap: 2 },
});
