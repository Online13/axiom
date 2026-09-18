import { useState } from 'react';
import { View } from 'react-native';

import { BottomTabBar } from '@/components/ui/bottom-tab-bar';
import { IconButton } from '@/components/ui/icon-button';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Label, Panel, Row, Section } from '@/demo/section';
import { Screen } from '@/demo/screen';
import { useTheme } from '@/theme';

/** A frame standing in for the bottom of a screen. */
function Frame({ children }: { children: React.ReactNode }) {
  const { tokens, colors } = useTheme();

  return (
    <View
      style={{
        overflow: 'hidden',
        justifyContent: 'flex-end',
        minHeight: 110,
        borderRadius: tokens.radius.lg,
        borderWidth: tokens.metrics.hairline,
        borderColor: colors.border.default,
        backgroundColor: colors.background.subtle,
      }}
    >
      {children}
    </View>
  );
}

export default function BottomTabBarScreen() {
  const [route, setRoute] = useState('home');
  const [floating, setFloating] = useState('home');
  const [withMain, setWithMain] = useState('home');
  const [unread, setUnread] = useState(3);

  return (
    <Screen>
      <Section title="BottomTabBar" description="Three to five destinations, with a badge for new content.">
        <Panel>
          <Row label="Unread" description={`Inbox badge · ${unread}`}>
            <Switch value={unread > 0} onValueChange={(on) => setUnread(on ? 3 : 0)} accessibilityLabel="Unread" />
          </Row>
          <Label muted>Current route: {route}</Label>
        </Panel>
        <Frame>
          <BottomTabBar safeArea={false} value={route} onValueChange={setRoute}>
            <BottomTabBar.Item value="home" icon="favorite" label="Home" />
            <BottomTabBar.Item value="inbox" icon="file" label="Inbox" badge={unread} />
            <BottomTabBar.Item value="calendar" icon="calendar" label="Calendar" />
            <BottomTabBar.Item value="profile" icon="settings" label="Profile" disabled />
          </BottomTabBar>
        </Frame>
      </Section>

      <Section title="Floating" description="An inset pill instead of a bar pinned to the edge.">
        <Frame>
          <BottomTabBar safeArea={false} variant="floating" value={floating} onValueChange={setFloating}>
            <BottomTabBar.Item value="home" icon="favorite" label="Home" />
            <BottomTabBar.Item value="search" icon="search" label="Search" />
            <BottomTabBar.Item value="profile" icon="settings" label="Profile" badge />
          </BottomTabBar>
        </Frame>
      </Section>

      <Section title="Main action" description="A raised action in the middle. It never becomes the selected route.">
        <Frame>
          <BottomTabBar
            safeArea={false}
            value={withMain}
            onValueChange={setWithMain}
            mainAction={
              <IconButton icon="add" variant="solid" size="lg" accessibilityLabel="New entry" onPress={() => {}} />
            }
          >
            <BottomTabBar.Item value="home" icon="favorite" label="Home" />
            <BottomTabBar.Item value="search" icon="search" label="Search" />
            <BottomTabBar.Item value="inbox" icon="file" label="Inbox" />
            <BottomTabBar.Item value="profile" icon="settings" label="Profile" />
          </BottomTabBar>
        </Frame>
        <Text variant="footnote" color="muted">
          The action sits between the second and third item.
        </Text>
      </Section>
    </Screen>
  );
}
