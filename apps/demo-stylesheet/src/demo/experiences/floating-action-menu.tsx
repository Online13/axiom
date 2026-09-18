import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Overlay } from '@/components/core/overlay';
import { Tappable } from '@/components/core/tappable';
import { FloatingButton } from '@/components/ui/floating-button';
import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/components/ui/icons';
import { Text } from '@/components/ui/text';
import { useOverlayBackHandler } from '@/hooks/use-overlay-back-handler';
import { useTheme } from '@/theme';

import { ExperienceScreen, ListRow, Note, fakeRows } from './shared';

const ACTIONS: { icon: IconName; label: string }[] = [
  { icon: 'edit', label: 'Text note' },
  { icon: 'check', label: 'Checklist' },
  { icon: 'image', label: 'Photo' },
];

export default function FloatingActionMenuScreen() {
  const { tokens, colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState('One entry point for creating; the choice comes after.');

  // The back gesture closes the menu instead of leaving the screen.
  useOverlayBackHandler(open, () => setOpen(false));

  const pick = (label: string) => {
    setOpen(false);
    setLog(`${label} created.`);
  };

  return (
    <ExperienceScreen>
      <Note>{log}</Note>
      <View style={styles.fill}>
        <ScrollView contentContainerStyle={{ paddingBottom: tokens.spacing[12] * 2 }}>
          {fakeRows(10).map((row) => (
            <ListRow key={row.id} title={row.title} subtitle={row.subtitle} />
          ))}
        </ScrollView>

        <Overlay visible={open} onPress={() => setOpen(false)} />

        {open ? (
          <View style={[styles.actions, { padding: tokens.metrics.screenMargin, gap: tokens.spacing[3] }]}>
            {ACTIONS.map((action) => (
              <Tappable
                key={action.label}
                accessibilityRole="button"
                accessibilityLabel={action.label}
                onPress={() => pick(action.label)}
                style={[styles.action, { gap: tokens.spacing[3] }]}
              >
                <Text weight="medium" style={{ color: colors.content.inverse }}>
                  {action.label}
                </Text>
                <View
                  style={[
                    styles.bubble,
                    { borderRadius: tokens.radius.full, backgroundColor: colors.background.elevated },
                  ]}
                >
                  <Icon name={action.icon} size="sm" />
                </View>
              </Tappable>
            ))}
          </View>
        ) : null}

        <FloatingButton
          icon={open ? 'close' : 'add'}
          accessibilityLabel={open ? 'Close the create menu' : 'Create'}
          onPress={() => setOpen((current) => !current)}
        />
      </View>
    </ExperienceScreen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  // The actions rise from the button, right above it.
  actions: { position: 'absolute', right: 0, bottom: 72, alignItems: 'flex-end' },
  action: { flexDirection: 'row', alignItems: 'center' },
  bubble: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
