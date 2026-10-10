import { StyleSheet } from "react-native-unistyles";

export function useConversationItemStyles() {
	return {
		content: { style: styles.content },
		row: { style: styles.row },
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create((theme) => ({
	content: {
		gap: theme.tokens.spacing[1],
	},
	row: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
}));
