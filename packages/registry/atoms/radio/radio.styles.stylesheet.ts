import { StyleSheet } from "react-native";

import { useTheme, type Spacing, type Theme } from "@/theme";

import type { RadioGroupProps, RadioOrientation } from "./radio";
import { stateColors } from "@/theme/components/states";

const SIZE = 22;

function radioColors(
	components: Theme["components"],
	checked: boolean,
	disabled: boolean,
) {
	const states = components.radio.default;
	return stateColors(states, checked && "checked", disabled && "disabled");
}

export function useRadioStyles() {
	const { tokens, components } = useTheme();

	return {
		group: (
			orientation: RadioOrientation,
			gap: keyof Spacing,
			{ style }: Pick<RadioGroupProps, "style">,
		) => ({
			style: [
				{ gap: tokens.spacing[gap] },
				orientation === "horizontal" && styles.horizontal,
				style,
			],
		}),
		row: { style: [styles.row, { gap: tokens.spacing[3] }] },
		text: { style: styles.text },
		circle: (checked: boolean, disabled: boolean) => ({
			style: [
				styles.circle,
				{ borderColor: radioColors(components, checked, disabled).border },
			],
		}),
		dot: (checked: boolean, disabled: boolean) => ({
			style: [
				styles.dot,
				{
					backgroundColor: radioColors(components, checked, disabled)
						.indicator,
				},
			],
		}),
	};
}

const styles = StyleSheet.create({
	horizontal: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	row: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	circle: {
		width: SIZE,
		height: SIZE,
		borderRadius: SIZE / 2,
		borderWidth: 2,
		alignItems: "center",
		justifyContent: "center",
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	text: {
		flexShrink: 1,
		gap: 2,
	},
});
