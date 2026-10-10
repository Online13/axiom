import { StyleSheet } from "react-native";

import { Icon } from "@/components/ui/icon";
import { useTheme, type Theme } from "@/theme";

import type { CheckboxProps } from "./checkbox";
import { stateColors } from "@/theme/components/states";

const BOX = 22;

function checkboxColors(
	components: Theme["components"],
	on: boolean,
	error: boolean,
	disabled: boolean,
) {
	const states = components.checkbox.default;
	return stateColors(
		states,
		on && "checked",
		error && !disabled && "invalid",
		disabled && "disabled",
	);
}

// The icon takes its color as a prop.
export const CheckboxIcon = Icon;

export function useCheckboxStyles() {
	const { tokens, components } = useTheme();

	return {
		row: ({ style }: Pick<CheckboxProps, "style">) => ({
			style: [styles.row, { gap: tokens.spacing[3] }, style],
		}),
		text: { style: styles.text },
		box: (on: boolean, error: boolean, disabled: boolean) => ({
			style: [
				styles.box,
				{
					borderRadius: tokens.radius.sm,
					borderColor: checkboxColors(components, on, error, disabled)
						.border,
					backgroundColor:
						checkboxColors(components, on, error, disabled).background ??
						"transparent",
				},
			],
		}),
		indicator: (on: boolean, error: boolean, disabled: boolean) => ({
			color: checkboxColors(components, on, error, disabled).indicator,
		}),
	};
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	box: {
		width: BOX,
		height: BOX,
		borderWidth: 2,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		flex: 1,
		gap: 2,
	},
});
