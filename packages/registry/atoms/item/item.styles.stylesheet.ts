import { StyleSheet, type ViewStyle } from "react-native";

import { type TappableState } from "@/components/core/tappable";
import { useTheme, type Theme } from "@/theme";

import type {
	ItemAlign,
	ItemAreaProps,
	ItemDivider,
	ItemProps,
	ItemSize,
} from "./item";
import { stateColors } from "@/theme/components/states";

const MIN_HEIGHT: Record<ItemSize, number> = { sm: 44, md: 52, lg: 64 };

export function useItemStyles() {
	const theme = useTheme();
	const { tokens, components } = theme;

	return {
		row: (
			size: ItemSize,
			align: ItemAlign,
			selected: boolean,
			{ style }: Pick<ItemProps, "style">,
		) => ({
			style: [
				styles.row,
				rowStyle(theme, size, align, selected, false),
				style,
			],
		}),
		pressableRow: (
			size: ItemSize,
			align: ItemAlign,
			selected: boolean,
			{ style }: Pick<ItemProps, "style">,
		) => ({
			style: ({ pressed }: TappableState) => [
				styles.row,
				rowStyle(theme, size, align, selected, pressed),
				style,
			],
		}),
		// `inset` starts the line after the leading area, once it has been measured.
		divider: (divider: ItemDivider, leadingWidth: number) => ({
			style: [
				styles.divider,
				{
					height: tokens.metrics.hairline,
					left:
						divider === "inset" && leadingWidth > 0
							? tokens.metrics.screenMargin +
								leadingWidth +
								tokens.spacing[3]
							: tokens.metrics.screenMargin,
					backgroundColor: components.item.default.default.divider,
				},
			],
		}),
		leading: ({ style }: Pick<ItemAreaProps, "style">) => ({
			style: [styles.side, style],
		}),
		trailing: ({ style }: Pick<ItemAreaProps, "style">) => ({
			style: [styles.side, { gap: tokens.spacing[2] }, style],
		}),
		content: ({ style }: Pick<ItemAreaProps, "style">) => ({
			style: [styles.content, style],
		}),
	};
}

function rowStyle(
	{ tokens, components }: Theme,
	size: ItemSize,
	align: ItemAlign,
	selected: boolean,
	pressed: boolean,
): ViewStyle {
	const states = components.item.default;
	const colors = stateColors(
		states,
		selected && "selected",
		pressed && "pressed",
	);
	return {
		minHeight: MIN_HEIGHT[size],
		gap: tokens.spacing[3],
		paddingHorizontal: tokens.metrics.screenMargin,
		paddingVertical: tokens.spacing[2],
		alignItems: align === "center" ? "center" : "flex-start",
		backgroundColor: colors.background ?? "transparent",
	};
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
	},
	side: {
		flexDirection: "row",
		alignItems: "center",
	},
	content: {
		flex: 1,
		gap: 2,
	},
	divider: {
		position: "absolute",
		right: 0,
		bottom: 0,
	},
});
