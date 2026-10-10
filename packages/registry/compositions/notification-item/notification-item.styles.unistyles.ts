import { StyleSheet } from "react-native-unistyles";

const TILE = 40;

export function useNotificationItemStyles() {
	return {
		item: { style: styles.item },
		tile: { style: styles.tile },
		content: { style: styles.content },
		action: { style: styles.action },
		dot: { style: styles.dot },
	};
}

const styles = StyleSheet.create((theme) => ({
	item: {
		paddingVertical: theme.tokens.spacing[3],
	},
	tile: {
		width: TILE,
		height: TILE,
		borderRadius: theme.tokens.radius.full,
		backgroundColor: theme.colors.primary.subtle,
		alignItems: "center",
		justifyContent: "center",
	},
	content: {
		gap: theme.tokens.spacing[1],
	},
	action: {
		paddingTop: theme.tokens.spacing[1],
		flexDirection: "row",
	},
	dot: {
		paddingTop: theme.tokens.spacing[2],
	},
}));
