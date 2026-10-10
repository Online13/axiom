import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import type { Theme } from "@/theme";

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

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `indicator` gives it.
export const CheckboxIcon = withUnistyles(Icon);

export function useCheckboxStyles() {
	return {
		row: ({ style }: Pick<CheckboxProps, "style">) => ({
			style: [styles.row, style],
		}),
		text: { style: styles.text },
		box: (on: boolean, error: boolean, disabled: boolean) => ({
			style: styles.box(on, error, disabled),
		}),
		indicator: (on: boolean, error: boolean, disabled: boolean) => ({
			uniProps: (theme: Theme) => ({
				color: checkboxColors(theme.components, on, error, disabled)
					.indicator,
			}),
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	row: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: theme.tokens.spacing[3],
	},
	box: (on: boolean, error: boolean, disabled: boolean) => {
		const colors = checkboxColors(theme.components, on, error, disabled);
		return {
			width: BOX,
			height: BOX,
			borderWidth: 2,
			alignItems: "center",
			justifyContent: "center",
			borderRadius: theme.tokens.radius.sm,
			borderColor: colors.border,
			backgroundColor: colors.background ?? "transparent",
		};
	},
	text: {
		flex: 1,
		gap: 2,
	},
}));
