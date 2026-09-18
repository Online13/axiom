import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { PortalHost, PortalProvider } from '@/components/core/portal';
import { SnackbarHost } from '@/components/ui/snackbar';
import { Toaster } from '@/components/ui/toast';
import { ThemeButton } from '@/demo/theme-button';
import { useTheme } from '@/theme';

export default function RootLayout() {
  const { colors } = useTheme();

  return (
    <GestureHandlerRootView style={styles.root}>
      <KeyboardProvider>
        <PortalProvider>
          <StatusBar style="auto" />
          {/* Every screen draws its own AppBar, so the navigator has no header of its own. */}
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background.subtle },
            }}
          />
          <ThemeButton />
          <Toaster />
          <SnackbarHost />
          <PortalHost />
        </PortalProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
