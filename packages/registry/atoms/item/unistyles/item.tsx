import { createContext, use, useState, type ReactNode } from "react";
import {
	View,
	type AccessibilityRole,
	type AccessibilityState,
	type LayoutChangeEvent,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Slot } from "@/components/core/slot";
import { Tappable } from "@/components/core/tappable";
import { Text } from "@/components/ui/text";

export type ItemSize = "sm" | "md" | "lg";
export type ItemAlign = "center" | "start";
export type ItemDivider = boolean | "inset";

export type ItemProps = {
	/** `Item.Leading`, `Item.Content` and `Item.Trailing`, in that order. */
	children?: ReactNode;
	onPress?: () => void;
	onLongPress?: () => void;
	/** Minimum height: 44, 52 or 64pt. */
	size?: ItemSize;
	selected?: boolean;
	disabled?: boolean;
	/** Hairline under the row. `inset` starts it after the leading area. */
	divider?: ItemDivider;
	/** Vertical alignment of leading and trailing. */
	align?: ItemAlign;
	/** Merges the item into its child, for example a router `Link`. */
	asChild?: boolean;
	accessibilityLabel?: string;
	accessibilityRole?: AccessibilityRole;
	/** Merged with `selected` and `disabled`. */
	accessibilityState?: AccessibilityState;
	style?: StyleProp<ViewStyle>;
};

const MIN_HEIGHT: Record<ItemSize, number> = { sm: 44, md: 52, lg: 64 };

type ItemContextValue = {
	disabled: boolean;
	setLeadingWidth: (width: number) => void;
};

const ItemContext = createContext<ItemContextValue>({
	disabled: false,
	setLeadingWidth: () => {},
});

export function useItem() {
	return use(ItemContext);
}

function ItemRoot({
	children,
	onPress,
	onLongPress,
	size = "md",
	selected = false,
	disabled = false,
	divider = false,
	align = "center",
	asChild = false,
	accessibilityLabel,
	accessibilityRole,
	accessibilityState,
	style,
}: ItemProps) {
	const [leadingWidth, setLeadingWidth] = useState(0);

	const rowStyle = (pressed: boolean): StyleProp<ViewStyle> => [
		styles.row(size, align, selected, pressed),
		style,
	];

	const line = divider ? (
		<View style={styles.divider(divider, leadingWidth)} />
	) : null;

	const context = { disabled, setLeadingWidth };
	const a11yState = {
		...accessibilityState,
		selected: accessibilityState?.selected ?? selected,
	};
	const interactive = onPress !== undefined || onLongPress !== undefined;

	if (asChild) {
		return (
			<ItemContext value={context}>
				<Slot
					style={rowStyle(false)}
					accessibilityRole={accessibilityRole}
					accessibilityState={{ ...a11yState, disabled }}
				>
					{children}
				</Slot>
			</ItemContext>
		);
	}

	if (!interactive) {
		return (
			<ItemContext value={context}>
				<View
					accessibilityLabel={accessibilityLabel}
					accessibilityRole={accessibilityRole}
					accessibilityState={a11yState}
					style={rowStyle(false)}
				>
					{children}
					{line}
				</View>
			</ItemContext>
		);
	}

	return (
		<ItemContext value={context}>
			<Tappable
				disabled={disabled}
				accessibilityLabel={accessibilityLabel}
				accessibilityRole={accessibilityRole}
				accessibilityState={a11yState}
				onPress={onPress}
				onLongPress={onLongPress}
				style={({ pressed }) => rowStyle(pressed)}
			>
				{children}
				{line}
			</Tappable>
		</ItemContext>
	);
}

type AreaProps = { children?: ReactNode; style?: StyleProp<ViewStyle> };

function ItemLeading({ children, style }: AreaProps) {
	const { setLeadingWidth } = useItem();
	const onLayout = (event: LayoutChangeEvent) =>
		setLeadingWidth(event.nativeEvent.layout.width);

	return (
		<View onLayout={onLayout} style={[styles.side, style]}>
			{children}
		</View>
	);
}

function ItemTrailing({ children, style }: AreaProps) {
	return <View style={[styles.trailing, style]}>{children}</View>;
}

function ItemContent({ children, style }: AreaProps) {
	return <View style={[styles.content, style]}>{children}</View>;
}

function ItemTitle({
	children,
	numberOfLines = 1,
}: {
	children?: ReactNode;
	numberOfLines?: number;
}) {
	const { disabled } = useItem();
	return (
		<Text
			numberOfLines={numberOfLines}
			color={disabled ? "disabled" : "default"}
		>
			{children}
		</Text>
	);
}

function ItemDescription({
	children,
	numberOfLines = 1,
}: {
	children?: ReactNode;
	numberOfLines?: number;
}) {
	const { disabled } = useItem();
	return (
		<Text
			variant="footnote"
			numberOfLines={numberOfLines}
			color={disabled ? "disabled" : "muted"}
		>
			{children}
		</Text>
	);
}

export const Item = Object.assign(ItemRoot, {
	Leading: ItemLeading,
	Content: ItemContent,
	Title: ItemTitle,
	Description: ItemDescription,
	Trailing: ItemTrailing,
});

const styles = StyleSheet.create((theme) => ({
	row: (
		size: ItemSize,
		align: ItemAlign,
		selected: boolean,
		pressed: boolean,
	) => {
		const states = theme.components.item.default;
		const colors = {
			...states.default,
			...(selected ? states.selected : undefined),
			...(pressed ? states.pressed : undefined),
		};
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
