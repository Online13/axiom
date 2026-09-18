import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBar } from '@/components/ui/app-bar';
import { IconButton } from '@/components/ui/icon-button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Label, Panel, Row, Section } from '@/demo/section';
import { Screen } from '@/demo/screen';
import { useTheme } from '@/theme';

/** A frame standing in for the top of a screen, so a bar can be shown inside the demo. */
function Frame({ children }: { children: React.ReactNode }) {
  const { tokens, colors } = useTheme();

  return (
    <View
      style={{
        overflow: 'hidden',
        borderRadius: tokens.radius.lg,
        borderWidth: tokens.metrics.hairline,
        borderColor: colors.border.default,
        backgroundColor: colors.background.default,
      }}
    >
      {children}
    </View>
  );
}

function Body({ lines = 2 }: { lines?: number }) {
  const { tokens, colors } = useTheme();

  return (
    <View style={{ padding: tokens.spacing[4], gap: tokens.spacing[2] }}>
      {Array.from({ length: lines }, (_, i) => (
        <View
          key={i}
          style={{
            height: 10,
            width: i % 2 === 0 ? '80%' : '55%',
            borderRadius: 5,
            backgroundColor: colors.background.subtle,
          }}
        />
      ))}
    </View>
  );
}

export default function AppBarScreen() {
  const { tokens } = useTheme();
  const [collapse, setCollapse] = useState(0);
  const [elevation, setElevation] = useState(1);
  const [bordered, setBordered] = useState(true);
  const [query, setQuery] = useState('');

  return (
    <Screen>
      <Section title="AppBar" description="A leading control, a centered title and up to two actions.">
        <Panel>
          <Row label="Bordered">
            <Switch value={bordered} onValueChange={setBordered} accessibilityLabel="Bordered" />
          </Row>
        </Panel>
        <Frame>
          <AppBar safeArea={false} bordered={bordered}>
            <AppBar.Leading>
              <IconButton icon="chevron-left" accessibilityLabel="Back" onPress={() => {}} />
            </AppBar.Leading>
            <AppBar.Title>Order #1842</AppBar.Title>
            <AppBar.Actions>
              <IconButton icon="share" accessibilityLabel="Share order" onPress={() => {}} />
              <IconButton icon="settings" accessibilityLabel="More actions" onPress={() => {}} />
            </AppBar.Actions>
          </AppBar>
          <Body />
        </Frame>
      </Section>

      <Section title="Large title and search" description="Drag the slider: the large title folds into the bar.">
        <Panel>
          <Text variant="bodySm" weight="medium">
            collapseProgress · {collapse.toFixed(2)}
          </Text>
          <Slider value={collapse} onValueChange={setCollapse} min={0} max={1} step={0.01} accessibilityLabel="Collapse progress" />
        </Panel>
        <Frame>
          <AppBar safeArea={false} variant="large" collapseProgress={collapse} bordered>
            <AppBar.Title>Messages</AppBar.Title>
            <AppBar.Actions>
              <IconButton icon="edit" accessibilityLabel="New message" onPress={() => {}} />
            </AppBar.Actions>
            <AppBar.Search value={query} onChangeText={setQuery} placeholder="Search" showCancel={false} />
          </AppBar>
          <Body lines={3} />
        </Frame>
      </Section>

      <Section title="Elevation" description="The background and the hairline fade in as content scrolls under the bar.">
        <Panel>
          <Text variant="bodySm" weight="medium">
            elevationProgress · {elevation.toFixed(2)}
          </Text>
          <Slider value={elevation} onValueChange={setElevation} min={0} max={1} step={0.01} accessibilityLabel="Elevation progress" />
          <Label muted>At 0 the bar is transparent: the content shows through.</Label>
        </Panel>
        <Frame>
          <View style={[StyleSheet.absoluteFill, { padding: tokens.spacing[3] }]}>
            <Text variant="bodySm" color="muted">
              Content behind the bar
            </Text>
          </View>
          <AppBar safeArea={false} elevationProgress={elevation}>
            <AppBar.Leading>
              <IconButton icon="chevron-left" accessibilityLabel="Back" onPress={() => {}} />
            </AppBar.Leading>
            <AppBar.Title>Profile</AppBar.Title>
          </AppBar>
          <Body />
        </Frame>
      </Section>
    </Screen>
  );
}
