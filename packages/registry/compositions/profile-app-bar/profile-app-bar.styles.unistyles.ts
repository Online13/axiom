import { StyleSheet } from "react-native-unistyles";

import { type TappableState } from "@/components/core/tappable";

export function useProfileAppBarStyles() {
	return {
		start: { style: styles.start },
		identity: { style: styles.identity },
		shrink: { style: styles.shrink },
		pressable: {
			style: ({ pressed }: TappableState) => [
				styles.shrink,
				{ opacity: pressed ? 0.6 : 1 },
			],
		},
	};
}

const styles = StyleSheet.create((theme) => ({
	// The pressable hugs the avatar and the name instead of stretching across the row.
	start: {
		alignItems: "flex-start",
	},
	identity: {
		gap: theme.tokens.spacing[2],
		flexDirection: "row",
		alignItems: "center",
	},
	shrink: {
		flexShrink: 1,
	},
}));
