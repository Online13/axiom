import { StyleSheet } from "react-native-unistyles";

import type { ButtonGroupProps } from "./button-group";

export function useButtonGroupStyles() {
	return {
		group: (
			orientation: "horizontal" | "vertical",
			bordered: boolean,
			radius: number | undefined,
			{ style }: Pick<ButtonGroupProps, "style">,
		) => ({
			style: [
				styles.group(radius),
				orientation === "horizontal" ? styles.row : styles.column,
				bordered && styles.bordered,
				style,
			],
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	group: (radius?: number) => ({
		alignSelf: "flex-start",
		overflow: "hidden",
		borderRadius: radius ?? theme.components.button.radius,
	}),
	row: {
		flexDirection: "row",
	},
	column: {
		flexDirection: "column",
	},
	bordered: {
		borderWidth: theme.tokens.metrics.hairline,
		borderColor: theme.colors.border.default,
	},
}));
