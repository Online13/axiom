import { useState } from 'react';
import Animated from 'react-native-reanimated';

import { AppBar } from '@/components/ui/app-bar';
import { IconButton } from '@/components/ui/icon-button';
import { BackButton } from '@/demo/screen';
import { useLargeTitle } from '@/demo/use-large-title';
import { useTheme } from '@/theme';

import { ExperienceScreen, ListRow, Note, fakeRows } from './shared';

export default function CollapsibleHeaderScreen() {
  const { tokens, colors } = useTheme();
  const [query, setQuery] = useState('');
  const rows = fakeRows(30);

  const { collapse, onScroll } = useLargeTitle();

  return (
    <ExperienceScreen
      appBar={
        <AppBar safeArea={false} variant="large" collapseProgress={collapse} bordered backgroundColor={colors.background.subtle}>
          <AppBar.Leading>
            <BackButton />
          </AppBar.Leading>
          <AppBar.Title>Messages</AppBar.Title>
          <AppBar.Actions>
            <IconButton icon="edit" accessibilityLabel="New message" onPress={() => {}} />
          </AppBar.Actions>
          <AppBar.Search value={query} onChangeText={setQuery} placeholder="Search" showCancel={false} />
        </AppBar>
      }
    >
      <Note>Scroll the list: the large title and the field fold into the compact bar, then come back at the top.</Note>
      <Animated.FlatList
        data={rows.filter((row) => row.title.toLowerCase().includes(query.trim().toLowerCase()))}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ListRow title={item.title} subtitle={item.subtitle} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: tokens.spacing[12] * 2 }}
      />
    </ExperienceScreen>
  );
}
