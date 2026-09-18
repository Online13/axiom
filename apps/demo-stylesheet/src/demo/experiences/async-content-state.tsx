import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Empty } from '@/components/ui/empty';
import { IconButton } from '@/components/ui/icon-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Skeleton } from '@/components/ui/skeleton';
import { snackbar } from '@/components/ui/snackbar';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme';

import { ExperienceScreen, ListRow, Note, fakeRows } from './shared';

type Answer = 'content' | 'empty' | 'error';
type Network = 'online' | 'offline';
type State = 'loading' | 'content' | 'empty' | 'error' | 'offline';

export default function AsyncContentStateScreen() {
  const { tokens, colors } = useTheme();
  const [answer, setAnswer] = useState<Answer>('content');
  const [network, setNetwork] = useState<Network>('online');
  const [state, setState] = useState<State>('loading');
  const [rows, setRows] = useState<ReturnType<typeof fakeRows>>([]);
  const [retrying, setRetrying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Every load is one run of this effect: mount, a change in the footer, or a retry.
  useEffect(() => {
    let active = true;

    const timer = setTimeout(() => {
      if (!active) return;

      setRetrying(false);
      if (network === 'offline') return setState('offline');
      if (answer === 'error') return setState('error');
      if (answer === 'empty') {
        setRows([]);
        return setState('empty');
      }
      setRows(fakeRows(8));
      setState('content');
    }, 800);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [answer, network, attempt]);

  // Asking again is a new attempt, and every entry point goes back through `loading`.
  const load = () => {
    setState('loading');
    setAttempt((count) => count + 1);
  };

  const retry = () => {
    setRetrying(true);
    load();
  };

  // A refresh with content on screen never falls back to the loading state.
  const refresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setRefreshing(false);

    if (network === 'offline' || answer === 'error') {
      snackbar.show({ message: 'Couldn’t refresh the orders', action: { label: 'Retry', onPress: refresh } });
      return;
    }
    setRows(fakeRows(8, 3));
  };

  return (
    <ExperienceScreen
      actions={
        state === 'content' ? (
          <IconButton
            icon="refresh"
            accessibilityLabel="Refresh the orders"
            disabled={refreshing}
            onPress={refresh}
          />
        ) : undefined
      }
    >
      <Note>State: {state}. The footer chooses what the fake server answers next.</Note>

      <View style={{ flex: 1 }}>
        {state === 'loading' ? (
          <View style={{ padding: tokens.metrics.screenMargin, gap: tokens.spacing[4] }}>
            {Array.from({ length: 5 }, (_, index) => (
              <View key={index} style={{ gap: tokens.spacing[2] }}>
                <Skeleton width="60%" height={14} />
                <Skeleton width="35%" height={12} />
              </View>
            ))}
          </View>
        ) : null}

        {state === 'content' ? (
          <ScrollView contentContainerStyle={{ paddingBottom: tokens.spacing[8] }}>
            {rows.map((row) => (
              <ListRow key={row.id} title={row.title} subtitle={row.subtitle} />
            ))}
          </ScrollView>
        ) : null}

        {state === 'empty' ? (
          <Empty>
            <Empty.Media icon="file" />
            <Empty.Header>
              <Empty.Title>No orders yet</Empty.Title>
              <Empty.Description>Orders you place will show up here.</Empty.Description>
            </Empty.Header>
          </Empty>
        ) : null}

        {state === 'error' || state === 'offline' ? (
          <Empty>
            <Empty.Media icon={state === 'offline' ? 'warning' : 'error'} tone="error" />
            <Empty.Header>
              <Empty.Title>{state === 'offline' ? 'You are offline' : 'Something went wrong'}</Empty.Title>
              <Empty.Description>
                {state === 'offline'
                  ? 'The screen loads again on its own once the connection is back.'
                  : 'The orders couldn’t be loaded. Nothing was lost.'}
              </Empty.Description>
            </Empty.Header>
            <Empty.Content>
              <Button loading={retrying} onPress={retry}>
                Try again
              </Button>
            </Empty.Content>
          </Empty>
        ) : null}
      </View>

      <View
        style={{
          padding: tokens.metrics.screenMargin,
          gap: tokens.spacing[3],
          borderTopWidth: tokens.metrics.hairline,
          borderTopColor: colors.border.subtle,
        }}
      >
        <Text variant="footnote" color="muted">
          SERVER ANSWERS
        </Text>
        <SegmentedControl
          value={answer}
          onValueChange={(value) => { setAnswer(value as Answer); load(); }}
          options={['content', 'empty', 'error']}
        />
        <Text variant="footnote" color="muted">
          NETWORK
        </Text>
        <SegmentedControl
          value={network}
          onValueChange={(value) => { setNetwork(value as Network); load(); }}
          options={['online', 'offline']}
        />
      </View>
    </ExperienceScreen>
  );
}
