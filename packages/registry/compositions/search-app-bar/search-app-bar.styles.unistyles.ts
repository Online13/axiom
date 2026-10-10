import { StyleSheet } from "react-native-unistyles";

import type { SearchBarVariant } from "@/components/ui/search-bar";
import { searchBarColors } from "@/components/ui/search-bar-colors";

export function useSearchAppBarStyles() {
	return {
		cancel: styles.cancel,
		cancelInner: { style: styles.cancelInner },
		cancelLabel: (variant: SearchBarVariant) => ({
			style: styles.cancelLabel(variant),
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
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
		paddingHorizontal: theme.tokens.spacing[2],
	},
	cancelLabel: (variant: SearchBarVariant) => ({
		color: searchBarColors(theme.components, variant, "focused").cancel,
	}),
}));
