import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StyleSheet } from "react-native-unistyles";

import { PortalHost, PortalProvider } from "@/components/core/portal";
import { SnackbarHost } from "@/components/ui/snackbar";
import { Toaster } from "@/components/ui/toast";
import { ThemeButton } from "@/demo/theme-button";

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={styles.root}>
			<KeyboardProvider>
				<PortalProvider>
					<StatusBar style="auto" />
					{/* Every screen draws its own AppBar, so the navigator has no header of its own. */}
					<Stack
						screenOptions={{
							headerShown: false,
							contentStyle: styles.screen,
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

const styles = StyleSheet.create((theme) => ({
	root: { flex: 1 },
	screen: { backgroundColor: theme.colors.background.subtle },
}));
