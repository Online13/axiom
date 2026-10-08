import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { PortalHost, PortalProvider } from "@/components/core/portal";
import { SnackbarHost } from "@/components/ui/snackbar";
import { Toaster } from "@/components/ui/toast";
import { ThemeButton } from "@/demo/theme-button";
import { useTheme } from "@/theme";

export default function RootLayout() {
	const { colors } = useTheme();

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<KeyboardProvider>
				<PortalProvider>
					<StatusBar style="auto" />
					{/* Every screen draws its own AppBar, so the navigator has no header of its own. */}
					<Stack
						screenOptions={{
							headerShown: false,
							contentStyle: {
								backgroundColor: colors.background.subtle,
							},
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
