import { StyleSheet } from "react-native";

import type { SearchBarVariant } from "@/components/ui/search-bar";
import { searchBarColors } from "@/components/ui/search-bar-colors";
import { useTheme } from "@/theme";

export function useSearchAppBarStyles() {
	const { tokens, components } = useTheme();

	return {
		cancel: styles.cancel,
		cancelInner: {
			style: [styles.cancelInner, { paddingHorizontal: tokens.spacing[2] }],
		},
		// The cancel button takes the color the search bar gives it.
		cancelLabel: (variant: SearchBarVariant) => ({
			style: {
				color: searchBarColors(components, variant, "focused").cancel,
			},
		}),
	};
}

const styles = StyleSheet.create({
	cancel: {
		alignSelf: "stretch",
		overflow: "hidden",
	},
	cancelInner: {
		position: "absolute",
		start: 0,
		top: 0,
		bottom: 0,
		justifyContent: "center",
	},
});
