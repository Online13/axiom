import { StyleSheet } from "react-native-unistyles";

export function useEventCardStyles() {
	return {
		date: { style: styles.date },
		month: { style: styles.month },
		header: { style: styles.header },
		detail: { style: styles.detail },
		footer: { style: styles.footer },
		attendees: { style: styles.attendees },
		grow: { style: styles.grow },
	};
}

const styles = StyleSheet.create((theme) => ({
	date: {
		minWidth: theme.tokens.sizes.control.lg,
		paddingVertical: theme.tokens.spacing[1],
		paddingHorizontal: theme.tokens.spacing[2],
		borderRadius: theme.tokens.radius.md,
		backgroundColor: theme.colors.background.elevated,
		alignItems: "center",
	},
	month: {
		textTransform: "uppercase",
	},

	header: {
		gap: theme.tokens.spacing[2],
	},
	detail: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
		alignItems: "center",
	},

	footer: {
		gap: theme.tokens.spacing[3],
	},
	attendees: {
		gap: theme.tokens.spacing[2],
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	grow: {
		flex: 1,
	},
}));
