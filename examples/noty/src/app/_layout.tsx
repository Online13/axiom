import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StyleSheet } from "react-native-unistyles";

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={styles.root}>
			<KeyboardProvider>
				<StatusBar style="auto" />
				{/* Every screen draws its own AppBar, so the navigator has no header of its own. */}
				<Stack screenOptions={{ headerShown: false }} />
			</KeyboardProvider>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	root: { flex: 1 },
});
