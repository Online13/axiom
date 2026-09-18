import { useState } from 'react';

import { Scaffold } from '@/components/ui/scaffold';
import { Tab } from '@/components/ui/tab';
import { CatalogGroup, CatalogRow } from '@/demo/catalog';
import { CATEGORIES, groupsOf, screensOf, type Category } from '@/demo/screens';
import { useTheme } from '@/theme';

export default function ComponentsScreen() {
  const { tokens } = useTheme();
  const [category, setCategory] = useState<Category>('foundation');

  return (
    <Scaffold background="subtle" safeAreaEdges={['top']} keyboardAvoiding={false}>
      <Tab value={category} onValueChange={(value) => setCategory(value as Category)} style={{ paddingTop: tokens.spacing[2] }}>
        {CATEGORIES.map((item) => (
          <Tab.Item key={item.value} value={item.value}>
            {item.label}
          </Tab.Item>
        ))}
      </Tab>
      <Scaffold.Content
        contentContainerStyle={{
          padding: tokens.metrics.screenMargin,
          // Room for the tab bar and the theme button.
          paddingBottom: tokens.spacing[12] * 3,
          gap: tokens.spacing[8],
        }}
      >
        {groupsOf(category).map((group) => {
          const screens = screensOf(category).filter((screen) => screen.group === group);

          return (
            <CatalogGroup key={group} title={group}>
              {screens.map((screen, index) => (
                <CatalogRow
                  key={screen.name}
                  href={`/${screen.name}`}
                  title={screen.title}
                  description={screen.description}
                  divider={index < screens.length - 1}
                />
              ))}
            </CatalogGroup>
          );
        })}
      </Scaffold.Content>
    </Scaffold>
  );
}
