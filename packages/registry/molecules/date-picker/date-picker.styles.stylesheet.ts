import { StyleSheet } from "react-native";

import { Icon } from "@/components/ui/icon";
import { inputColors } from "@/components/ui/input-colors";
import type { InputState } from "@/components/ui/use-input";
import { useTheme } from "@/theme";

import type { DatePickerTriggerProps } from "./date-picker";

// The icon takes its color as a prop.
export const DatePickerIcon = Icon;

export function useDatePickerStyles() {
	const { tokens, components } = useTheme();

	return {
		control: (
			state: InputState,
			{ style }: Pick<DatePickerTriggerProps, "style">,
		) => ({
			style: [
				styles.control,
				{
					height: tokens.sizes.input.md,
					paddingHorizontal: tokens.spacing[3],
					gap: tokens.spacing[2],
					borderRadius: components.input.radius,
					backgroundColor:
						inputColors(components, "outline", state).background ??
						"transparent",
					borderColor:
						inputColors(components, "outline", state).border ??
						"transparent",
				},
				style,
			],
		}),
		icon: (state: InputState) => ({
			color: inputColors(components, "outline", state).affix,
		}),
		value: (state: InputState, empty: boolean) => ({
			style: [
				styles.value,
				{
					color: empty
						? inputColors(components, "outline", state).placeholder
						: inputColors(components, "outline", state).text,
				},
			],
		}),
	};
}

const styles = StyleSheet.create({
	control: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderCurve: "continuous",
	},
	value: {
		flex: 1,
	},
});
