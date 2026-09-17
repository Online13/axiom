import { useState } from 'react';
import { View } from 'react-native';

import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Label, Panel, Row, Section } from '@/demo/section';
import { Screen } from '@/demo/screen';
import { useTheme } from '@/theme';

export default function AlertScreen() {
  const { tokens } = useTheme();
  const [loading, setLoading] = useState(true);
  const [animation, setAnimation] = useState<'shimmer' | 'pulse'>('shimmer');
  const [dismissed, setDismissed] = useState(false);
  const [retries, setRetries] = useState(0);

  return (
    <Screen>
      <Section title="Spinner" description="Sizes, colors, delay. Turns on the UI thread; pulses with Reduce Motion.">
        <Panel>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[5] }}>
            <Spinner size="sm" />
            <Spinner />
            <Spinner size="lg" color="muted" />
            <Spinner size={32} color="link" />
            <Spinner delay={1500} label="Loading with a delay" />
            <Label muted>1.5s delay</Label>
          </View>
          <Button loading fullWidth>
            Button
          </Button>
        </Panel>
      </Section>

      <Section title="Skeleton" description="One shared clock: every placeholder stays in sync.">
        <Panel>
          <Row label="Loading">
            <Switch value={loading} onValueChange={setLoading} accessibilityLabel="Loading" />
          </Row>
          <Row label="Pulse instead of shimmer">
            <Switch
              value={animation === 'pulse'}
              onValueChange={(on) => setAnimation(on ? 'pulse' : 'shimmer')}
              accessibilityLabel="Pulse"
            />
          </Row>
        </Panel>
        <Panel>
          {[0, 1].map((i) => (
            <View key={i} style={{ flexDirection: 'row', gap: tokens.spacing[3] }}>
              <Skeleton loading={loading} variant={animation} width={40} height={40} radius="full">
                <Avatar name={i === 0 ? 'Jane Cooper' : 'Wade Warren'} colorFromName />
              </Skeleton>
              <View style={{ flex: 1 }}>
                <Skeleton.Text loading={loading} animation={animation} lines={2}>
                  <Text weight="semibold">{i === 0 ? 'Jane Cooper' : 'Wade Warren'}</Text>
                  <Text variant="bodySm" color="muted">
                    Shared three photos from the trip to Porto.
                  </Text>
                </Skeleton.Text>
              </View>
            </View>
          ))}
          <Skeleton loading={loading} variant={animation} height={140} radius="lg" />
        </Panel>
      </Section>

      <Section title="Alert" description="Inline feedback, with an action or a close button.">
        <Alert variant="info" title="New version available">
          Restart the app to get the latest features.
        </Alert>
        <Alert variant="success" title="Backup complete" />
        {dismissed ? (
          <Button variant="ghost" onPress={() => setDismissed(false)}>
            Show the warning again
          </Button>
        ) : (
          <Alert
            variant="warning"
            title="Storage almost full"
            action={{ label: 'Manage storage', onPress: () => {} }}
            onDismiss={() => setDismissed(true)}
          >
            Free up space to keep syncing your photos.
          </Alert>
        )}
        <Alert variant="error" title="Payment failed" action={{ label: `Retry (${retries})`, onPress: () => setRetries((r) => r + 1) }}>
          Your card was declined.
        </Alert>
        <Alert variant="neutral" icon={null}>
          Neutral, without an icon or a title.
        </Alert>
      </Section>

      <Section title="Empty" description="Full-screen or compact, neutral or error.">
        <Panel>
          <Empty fill={false}>
            <Empty.Header>
              <Empty.Media icon="search" />
              <Empty.Title>No results</Empty.Title>
              <Empty.Description>Try another word, or check the spelling.</Empty.Description>
            </Empty.Header>
            <Empty.Content>
              <Button variant="outline">Clear search</Button>
            </Empty.Content>
          </Empty>
        </Panel>
        <Panel>
          <Empty size="sm" fill={false}>
            <Empty.Header>
              <Empty.Media icon="error" tone="error" />
              <Empty.Title>{"Couldn't load messages"}</Empty.Title>
              <Empty.Description>Check your connection.</Empty.Description>
            </Empty.Header>
            <Empty.Content>
              <Button size="sm">Retry</Button>
            </Empty.Content>
          </Empty>
        </Panel>
      </Section>
    </Screen>
  );
}
