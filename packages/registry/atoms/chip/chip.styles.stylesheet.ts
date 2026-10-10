import { StyleSheet, type ViewStyle } from "react-native";

import { type TappableState } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";
import { useTheme, type Spacing, type Theme } from "@/theme";

import type { ChipGroupProps, ChipProps, ChipSize, ChipVariant } from "./chip";
import { stateColors } from "@/theme/components/states";

const HEIGHT = { sm: 28, md: 34 };

function chipColors(
	components: Theme["components"],
	variant: ChipVariant,
	selected: boolean | undefined,
	pressed: boolean,
	disabled: boolean,
) {
	const states = components.chip[variant];
	return stateColors(
		states,
		selected && "selected",
		pressed && !selected && "pressed",
		disabled && "disabled",
	);
}

// The icon takes its color as a prop.
export const ChipIcon = Icon;

export function useChipStyles() {
	const theme = useTheme();
	const { tokens, components } = theme;

	return {
		chip: (
			variant: ChipVariant,
			size: ChipSize,
			selected: boolean | undefined,
			disabled: boolean,
			leading: boolean,
			trailing: boolean,
			removable: boolean,
			{ style }: Pick<ChipProps, "style">,
		) => ({
			style: [
				styles.chip,
				surfaceStyle(theme, variant, size, selected, false, disabled),
				paddingStyle(theme, leading, trailing, removable),
				style,
			],
		}),
		pressableChip: (
			variant: ChipVariant,
			size: ChipSize,
			selected: boolean | undefined,
			disabled: boolean,
			leading: boolean,
			trailing: boolean,
			removable: boolean,
			{ style }: Pick<ChipProps, "style">,
		) => ({
			style: ({ pressed }: TappableState) => [
				styles.chip,
				surfaceStyle(theme, variant, size, selected, pressed, disabled),
				paddingStyle(theme, leading, trailing, removable),
				style,
			],
		}),
		tint: (
			variant: ChipVariant,
			selected: boolean | undefined,
			pressed: boolean,
			disabled: boolean,
		) => ({
			color: chipColors(components, variant, selected, pressed, disabled)
				.foreground,
		}),
		label: (
			variant: ChipVariant,
			size: ChipSize,
			selected: boolean | undefined,
			pressed: boolean,
			disabled: boolean,
		) => ({
			style: [
				tokens.typography[size === "sm" ? "footnote" : "subheadline"],
				{
					color: chipColors(
						components,
						variant,
						selected,
						pressed,
						disabled,
					).foreground,
					fontWeight: FONT_WEIGHT.medium,
				},
			],
		}),
		remove: (size: ChipSize) => ({
			style: [
				styles.remove,
				{ width: HEIGHT[size] - 8, height: HEIGHT[size] - 8 },
			],
		}),
		group: (
			gap: keyof Spacing,
			{ style }: Pick<ChipGroupProps, "style">,
		) => ({
			style: [styles.row, styles.wrap, { gap: tokens.spacing[gap] }, style],
		}),
	};
}

function surfaceStyle(
	{ tokens, components }: Theme,
	variant: ChipVariant,
	size: ChipSize,
	selected: boolean | undefined,
	pressed: boolean,
	disabled: boolean,
): ViewStyle {
	const colors = chipColors(components, variant, selected, pressed, disabled);
	return {
		minHeight: HEIGHT[size],
		gap: tokens.spacing[1],
		borderRadius: components.chip.radius,
		backgroundColor: colors.background ?? "transparent",
		borderWidth: colors.border ? 1 : 0,
		borderColor: colors.border,
	};
}

function paddingStyle(
	{ tokens }: Theme,
	leading: boolean,
	trailing: boolean,
	removable: boolean,
): ViewStyle {
	return {
		paddingStart: leading ? tokens.spacing[2] : tokens.spacing[3],
		paddingEnd: removable
			? tokens.spacing[1]
			: trailing
				? tokens.spacing[2]
				: tokens.spacing[3],
	};
}

const styles = StyleSheet.create({
	chip: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
	},
	remove: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 9999,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	wrap: {
		flexWrap: "wrap",
	},
});
