import { StyleSheet } from "react-native";

import { type TappableState } from "@/components/core/tappable";
import { useTheme } from "@/theme";

export function useProfileAppBarStyles() {
	const { tokens } = useTheme();

	return {
		start: { style: styles.start },
		identity: { style: [styles.identity, { gap: tokens.spacing[2] }] },
		shrink: { style: styles.shrink },
		pressable: {
			style: ({ pressed }: TappableState) => [
				styles.shrink,
				{ opacity: pressed ? 0.6 : 1 },
			],
		},
	};
}

const styles = StyleSheet.create({
	// The pressable hugs the avatar and the name instead of stretching across the row.
	start: {
		alignItems: "flex-start",
	},
	identity: {
		flexDirection: "row",
		alignItems: "center",
	},
	shrink: {
		flexShrink: 1,
	},
});
