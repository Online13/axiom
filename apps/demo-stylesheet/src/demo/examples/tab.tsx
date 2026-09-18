import { useState } from 'react';
import { View } from 'react-native';

import { Tab } from '@/components/ui/tab';
import { Text } from '@/components/ui/text';
import { Label, Panel, Section } from '@/demo/section';
import { Screen } from '@/demo/screen';
import { useTheme } from '@/theme';

const ACTIVITY = {
  all: 'Everything that happened today.',
  mentions: 'Only the messages naming you.',
  requests: 'Two people are waiting for access.',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export default function TabScreen() {
  const { tokens } = useTheme();
  const [section, setSection] = useState<keyof typeof ACTIVITY>('all');
  const [view, setView] = useState('list');
  const [month, setMonth] = useState('March');

  return (
    <Screen>
      <Section title="Tab" description="An indicator slides under the selected label.">
        <Panel>
          <Tab value={section} onValueChange={(value) => setSection(value as keyof typeof ACTIVITY)}>
            <Tab.Item value="all">All</Tab.Item>
            <Tab.Item value="mentions">Mentions</Tab.Item>
            <Tab.Item value="requests" badge={2}>
              Requests
            </Tab.Item>
          </Tab>
          <View style={{ paddingTop: tokens.spacing[3] }}>
            <Text variant="bodySm" color="muted">
              {ACTIVITY[section]}
            </Text>
          </View>
        </Panel>
      </Section>

      <Section title="Pill" description="A capsule behind the label, for a filter inside a screen.">
        <Panel>
          <Tab variant="pill" value={view} onValueChange={setView}>
            <Tab.Item value="list" icon="file">
              List
            </Tab.Item>
            <Tab.Item value="grid" icon="image">
              Grid
            </Tab.Item>
            <Tab.Item value="map" disabled>
              Map
            </Tab.Item>
          </Tab>
          <Label muted>Selected: {view}</Label>
        </Panel>
      </Section>

      <Section title="Scrollable" description="Items keep their width and scroll when they no longer fit.">
        <Panel>
          <Tab scrollable value={month} onValueChange={setMonth}>
            {MONTHS.map((name) => (
              <Tab.Item key={name} value={name}>
                {name}
              </Tab.Item>
            ))}
          </Tab>
          <Label muted>Selected: {month}</Label>
        </Panel>
      </Section>
    </Screen>
  );
}
