import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

const THUMB = 44;

export function useSearchResultItemStyles() {
	const { tokens, colors } = useTheme();

	return {
		thumb: (shape: "square" | "circle") => ({
			style: [
				styles.thumb,
				{
					borderRadius:
						shape === "circle" ? tokens.radius.full : tokens.radius.sm,
				},
			],
		}),
		tile: (shape: "square" | "circle") => ({
			style: [
				styles.thumb,
				styles.center,
				{
					borderRadius:
						shape === "circle" ? tokens.radius.full : tokens.radius.sm,
					backgroundColor: colors.background.subtle,
				},
			],
		}),
	};
}

const styles = StyleSheet.create({
	thumb: {
		width: THUMB,
		height: THUMB,
	},
	center: {
		alignItems: "center",
		justifyContent: "center",
	},
});
