import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

import type { ButtonGroupProps } from "./button-group";

export function useButtonGroupStyles() {
	const { tokens, colors, components } = useTheme();

	return {
		group: (
			orientation: "horizontal" | "vertical",
			bordered: boolean,
			radius: number | undefined,
			{ style }: Pick<ButtonGroupProps, "style">,
		) => ({
			style: [
				styles.group,
				orientation === "horizontal" ? styles.row : styles.column,
				{ borderRadius: radius ?? components.button.radius },
				bordered && {
					borderWidth: tokens.metrics.hairline,
					borderColor: colors.border.default,
				},
				style,
			],
		}),
	};
}

const styles = StyleSheet.create({
	group: {
		alignSelf: "flex-start",
		overflow: "hidden",
	},
	row: {
		flexDirection: "row",
	},
	column: {
		flexDirection: "column",
	},
});
