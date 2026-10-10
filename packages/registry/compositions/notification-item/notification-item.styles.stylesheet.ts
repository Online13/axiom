import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

const TILE = 40;

export function useNotificationItemStyles() {
	const { tokens, colors } = useTheme();

	return {
		item: { style: { paddingVertical: tokens.spacing[3] } },
		tile: {
			style: [
				styles.tile,
				{
					borderRadius: tokens.radius.full,
					backgroundColor: colors.primary.subtle,
				},
			],
		},
		content: { style: { gap: tokens.spacing[1] } },
		action: { style: [styles.action, { paddingTop: tokens.spacing[1] }] },
		dot: { style: { paddingTop: tokens.spacing[2] } },
	};
}

const styles = StyleSheet.create({
	tile: {
		width: TILE,
		height: TILE,
		alignItems: "center",
		justifyContent: "center",
	},
	action: {
		flexDirection: "row",
	},
});
