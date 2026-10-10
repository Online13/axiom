import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { type TappableState } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import { FONT_WEIGHT } from "@/components/ui/text";
import type { Spacing, Theme } from "@/theme";

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

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`, which `tint` gives it.
export const ChipIcon = withUnistyles(Icon);

export function useChipStyles() {
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
				styles.chip(
					variant,
					size,
					selected,
					false,
					disabled,
					leading,
					trailing,
					removable,
				),
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
				styles.chip(
					variant,
					size,
					selected,
					pressed,
					disabled,
					leading,
					trailing,
					removable,
				),
				style,
			],
		}),
		tint: (
			variant: ChipVariant,
			selected: boolean | undefined,
			pressed: boolean,
			disabled: boolean,
		) => ({
			uniProps: (theme: Theme) => ({
				color: chipColors(
					theme.components,
					variant,
					selected,
					pressed,
					disabled,
				).foreground,
			}),
		}),
		label: (
			variant: ChipVariant,
			size: ChipSize,
			selected: boolean | undefined,
			pressed: boolean,
			disabled: boolean,
		) => ({
			style: styles.label(variant, size, selected, pressed, disabled),
		}),
		remove: (size: ChipSize) => ({ style: styles.remove(size) }),
		group: (
			gap: keyof Spacing,
			{ style }: Pick<ChipGroupProps, "style">,
		) => ({ style: [styles.wrapRow(gap), style] }),
	};
}

const styles = StyleSheet.create((theme) => ({
	chip: (
		variant: ChipVariant,
		size: ChipSize,
		selected: boolean | undefined,
		pressed: boolean,
		disabled: boolean,
		leading: boolean,
		trailing: boolean,
		removable: boolean,
	) => {
		const colors = chipColors(
			theme.components,
			variant,
			selected,
			pressed,
			disabled,
		);
		return {
			flexDirection: "row",
			alignItems: "center",
			alignSelf: "flex-start",
			minHeight: HEIGHT[size],
			gap: theme.tokens.spacing[1],
			paddingStart: leading
				? theme.tokens.spacing[2]
				: theme.tokens.spacing[3],
			paddingEnd: removable
				? theme.tokens.spacing[1]
				: trailing
					? theme.tokens.spacing[2]
					: theme.tokens.spacing[3],
			borderRadius: theme.components.chip.radius,
			backgroundColor: colors.background ?? "transparent",
			borderWidth: colors.border ? 1 : 0,
			borderColor: colors.border,
		};
	},
	label: (
		variant: ChipVariant,
		size: ChipSize,
		selected: boolean | undefined,
		pressed: boolean,
		disabled: boolean,
	) => ({
		...theme.tokens.typography[size === "sm" ? "footnote" : "subheadline"],
		color: chipColors(theme.components, variant, selected, pressed, disabled)
			.foreground,
		fontWeight: FONT_WEIGHT.medium,
	}),
	remove: (size: ChipSize) => ({
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 9999,
		width: HEIGHT[size] - 8,
		height: HEIGHT[size] - 8,
	}),
	wrapRow: (gap: keyof Spacing) => ({
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: theme.tokens.spacing[gap],
	}),
}));
