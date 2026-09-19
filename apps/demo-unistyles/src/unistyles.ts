import { StyleSheet } from "react-native-unistyles";

// Placeholder until the Axiom foundations exist (step 1).
const light = { colors: { background: "#ffffff", content: "#0a0a0a" } };
const dark = { colors: { background: "#0a0a0a", content: "#fafafa" } };

const themes = { light, dark };

type AppThemes = typeof themes;

declare module "react-native-unistyles" {
	export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
	themes,
	settings: { adaptiveThemes: true },
});
