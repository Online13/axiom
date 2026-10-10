import { StyleSheet } from "react-native-unistyles";

export function useSettingsSectionStyles() {
	return {
		section: { style: styles.section },
		text: { style: styles.text },
	};
}

const styles = StyleSheet.create((theme) => ({
	section: {
		gap: theme.tokens.spacing[2],
	},
	text: {
		paddingHorizontal: theme.tokens.metrics.screenMargin,
	},
}));
