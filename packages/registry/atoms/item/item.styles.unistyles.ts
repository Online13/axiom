import { StyleSheet } from "react-native-unistyles";

import { type TappableState } from "@/components/core/tappable";

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
	return {
		row: (
			size: ItemSize,
			align: ItemAlign,
			selected: boolean,
			{ style }: Pick<ItemProps, "style">,
		) => ({ style: [styles.row(size, align, selected, false), style] }),
		pressableRow: (
			size: ItemSize,
			align: ItemAlign,
			selected: boolean,
			{ style }: Pick<ItemProps, "style">,
		) => ({
			style: ({ pressed }: TappableState) => [
				styles.row(size, align, selected, pressed),
				style,
			],
		}),
		divider: (divider: ItemDivider, leadingWidth: number) => ({
			style: styles.divider(divider, leadingWidth),
		}),
		leading: ({ style }: Pick<ItemAreaProps, "style">) => ({
			style: [styles.side, style],
		}),
		trailing: ({ style }: Pick<ItemAreaProps, "style">) => ({
			style: [styles.trailing, style],
		}),
		content: ({ style }: Pick<ItemAreaProps, "style">) => ({
			style: [styles.content, style],
		}),
	};
}

const styles = StyleSheet.create((theme) => ({
	row: (
		size: ItemSize,
		align: ItemAlign,
		selected: boolean,
		pressed: boolean,
	) => {
		const states = theme.components.item.default;
		const colors = stateColors(
			states,
			selected && "selected",
			pressed && "pressed",
		);
		return {
			flexDirection: "row",
			minHeight: MIN_HEIGHT[size],
			gap: theme.tokens.spacing[3],
			paddingHorizontal: theme.tokens.metrics.screenMargin,
			paddingVertical: theme.tokens.spacing[2],
			alignItems: align === "center" ? "center" : "flex-start",
			backgroundColor: colors.background ?? "transparent",
		};
	},
	// `inset` starts the line after the leading area, once it has been measured.
	divider: (divider: ItemDivider, leadingWidth: number) => {
		const margin = theme.tokens.metrics.screenMargin;
		return {
			position: "absolute",
			right: 0,
			bottom: 0,
			height: theme.tokens.metrics.hairline,
			left:
				divider === "inset" && leadingWidth > 0
					? margin + leadingWidth + theme.tokens.spacing[3]
					: margin,
			backgroundColor: theme.components.item.default.default.divider,
		};
	},
	side: {
		flexDirection: "row",
		alignItems: "center",
	},
	trailing: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.tokens.spacing[2],
	},
	content: {
		flex: 1,
		gap: 2,
	},
}));
