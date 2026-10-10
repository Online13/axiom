import { StyleSheet } from "react-native-unistyles";

const THUMB = 44;

export function useSearchResultItemStyles() {
	return {
		thumb: (shape: "square" | "circle") => ({ style: styles.thumb(shape) }),
		tile: (shape: "square" | "circle") => ({
			style: [styles.thumb(shape), styles.tile],
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	thumb: (shape: "square" | "circle") => ({
		width: THUMB,
		height: THUMB,
		borderRadius:
			shape === "circle" ? theme.tokens.radius.full : theme.tokens.radius.sm,
	}),
	tile: {
		backgroundColor: theme.colors.background.subtle,
		alignItems: "center",
		justifyContent: "center",
	},
}));
