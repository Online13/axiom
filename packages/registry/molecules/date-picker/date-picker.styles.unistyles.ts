import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { Icon } from "@/components/ui/icon";
import { inputColors } from "@/components/ui/input-colors";
import type { InputState } from "@/components/ui/use-input";
import type { Theme } from "@/theme";

import type { DatePickerTriggerProps } from "./date-picker";

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `icon` gives it.
export const DatePickerIcon = withUnistyles(Icon);

export function useDatePickerStyles() {
	return {
		control: (
			state: InputState,
			{ style }: Pick<DatePickerTriggerProps, "style">,
		) => ({ style: [styles.control(state), style] }),
		icon: (state: InputState) => ({
			uniProps: (theme: Theme) => ({
				color: inputColors(theme.components, "outline", state).affix,
			}),
		}),
		value: (state: InputState, empty: boolean) => ({
			style: styles.value(state, empty),
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	control: (state: InputState) => {
		const colors = inputColors(theme.components, "outline", state);
		return {
			flexDirection: "row",
			alignItems: "center",
			borderWidth: 1,
			borderCurve: "continuous",
			height: theme.tokens.sizes.input.md,
			paddingHorizontal: theme.tokens.spacing[3],
			gap: theme.tokens.spacing[2],
			borderRadius: theme.components.input.radius,
			backgroundColor: colors.background ?? "transparent",
			borderColor: colors.border ?? "transparent",
		};
	},
	value: (state: InputState, empty: boolean) => {
		const colors = inputColors(theme.components, "outline", state);
		return {
			flex: 1,
			color: empty ? colors.placeholder : colors.text,
		};
	},
}));
