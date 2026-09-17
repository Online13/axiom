import { Link, type Href } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Tappable } from '@/components/core/tappable';
import { Text } from '@/components/ui/text';
import { SCREENS } from '@/demo/screens';
import { useTheme } from '@/theme';

export default function Index() {
  const { tokens, colors } = useTheme();
  const groups = [...new Set(SCREENS.map((screen) => screen.group))];

  return (
    <ScrollView
      style={{ backgroundColor: colors.background.subtle }}
      contentContainerStyle={{ padding: tokens.metrics.screenMargin, gap: tokens.spacing[6] }}
    >
      <Text variant="footnote" color="muted">
        Axiom demo · stylesheet
      </Text>
      {groups.map((group) => (
        <View key={group} style={{ gap: tokens.spacing[2] }}>
          <Text variant="footnote" color="muted" weight="semibold">
            {group.toUpperCase()}
          </Text>
          <View
            style={{
              borderRadius: tokens.radius.lg,
              borderWidth: tokens.metrics.hairline,
              borderColor: colors.border.default,
              backgroundColor: colors.background.elevated,
              overflow: 'hidden',
            }}
          >
            {SCREENS.filter((screen) => screen.group === group).map((screen, i) => (
              <Link key={screen.name} href={`/${screen.name}` as Href} asChild>
                <Tappable
                  accessibilityRole="link"
                  style={({ pressed }) => ({
                    padding: tokens.spacing[4],
                    gap: tokens.spacing[1],
                    backgroundColor: pressed ? colors.background.subtle : undefined,
                    borderTopWidth: i === 0 ? 0 : tokens.metrics.hairline,
                    borderTopColor: colors.border.subtle,
                  })}
                >
                  <Text variant="bodyLg" weight="semibold">
                    {screen.title}
                  </Text>
                  <Text variant="bodySm" color="muted">
                    {screen.description}
                  </Text>
                </Tappable>
              </Link>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
