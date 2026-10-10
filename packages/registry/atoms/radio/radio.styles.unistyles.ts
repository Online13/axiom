import { StyleSheet } from "react-native-unistyles";

import type { Spacing, Theme } from "@/theme";

import type { RadioGroupProps, RadioOrientation } from "./radio";
import { stateColors } from "@/theme/components/states";

const SIZE = 22;

export function useRadioStyles() {
	return {
		group: (
			orientation: RadioOrientation,
			gap: keyof Spacing,
			{ style }: Pick<RadioGroupProps, "style">,
		) => ({ style: [styles.group(orientation, gap), style] }),
		row: { style: styles.row },
		text: { style: styles.text },
		circle: (checked: boolean, disabled: boolean) => ({
			style: styles.circle(checked, disabled),
		}),
		dot: (checked: boolean, disabled: boolean) => ({
			style: styles.dot(checked, disabled),
		}),
	};
}

function radioColors(
	components: Theme["components"],
	checked: boolean,
	disabled: boolean,
) {
	const states = components.radio.default;
	return stateColors(states, checked && "checked", disabled && "disabled");
}

const styles = StyleSheet.create((theme) => ({
	group: (orientation: RadioOrientation, gap: keyof Spacing) => ({
		gap: theme.tokens.spacing[gap],
		...(orientation === "horizontal" && {
			flexDirection: "row",
			flexWrap: "wrap",
		}),
	}),
	row: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: theme.tokens.spacing[3],
	},
	circle: (checked: boolean, disabled: boolean) => ({
		width: SIZE,
		height: SIZE,
		borderRadius: SIZE / 2,
		borderWidth: 2,
		alignItems: "center",
		justifyContent: "center",
		borderColor: radioColors(theme.components, checked, disabled).border,
	}),
	dot: (checked: boolean, disabled: boolean) => ({
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: radioColors(theme.components, checked, disabled)
			.indicator,
	}),
	text: {
		flexShrink: 1,
		gap: 2,
	},
}));
