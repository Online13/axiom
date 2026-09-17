import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { PortalHost, PortalProvider } from '@/components/core/portal';
import { SCREENS } from '@/demo/screens';
import { ThemeButton } from '@/demo/theme-button';
import { useTheme } from '@/theme';

export default function RootLayout() {
  const { colors } = useTheme();

  return (
    <GestureHandlerRootView style={styles.root}>
      <PortalProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.background.default },
            headerTintColor: colors.content.default,
            contentStyle: { backgroundColor: colors.background.subtle },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Axiom' }} />
          {SCREENS.map((screen) => (
            <Stack.Screen key={screen.name} name={screen.name} options={{ title: screen.title }} />
          ))}
        </Stack>
        <ThemeButton />
        <PortalHost />
      </PortalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
