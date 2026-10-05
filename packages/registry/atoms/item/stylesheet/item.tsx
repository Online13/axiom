import {
	createContext,
	use,
	useState,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import {
	StyleSheet,
	View,
	type AccessibilityState,
	type LayoutChangeEvent,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { Slot } from "@/components/core/slot";
import type { HapticKind } from "@/components/core/haptics";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Text, type TextProps } from "@/components/ui/text";
import { useTheme } from "@/theme";

export type ItemSize = "sm" | "md" | "lg";

export type ItemProps = Omit<
	TappableProps,
	"children" | "style" | "disabled" | "onPress" | "onLongPress"
> & {
	/** `Item.Leading`, `Item.Content` and `Item.Trailing`, in that order. */
	children?: ReactNode;
	onPress?: TappableProps["onPress"];
	onLongPress?: TappableProps["onLongPress"];
	/** Minimum height: 44, 52 or 64pt. */
	size?: ItemSize;
	selected?: boolean;
	disabled?: boolean;
	/** Hairline under the row. `inset` starts it after the leading area. */
	divider?: boolean | "inset";
	/** Vertical alignment of leading and trailing. */
	align?: "center" | "start";
	/** Played on touch when the row is pressable. Off unless you pass a kind: a row tap is rarely an event. */
	haptic?: HapticKind | false;
	/** Merges the item into its child, for example a router `Link`. */
	asChild?: boolean;
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
	haptic,
	asChild = false,
	accessibilityLabel,
	accessibilityRole,
	accessibilityState,
	style,
	...props
}: ItemProps) {
	const { tokens, components } = useTheme();
	const [leadingWidth, setLeadingWidth] = useState(0);
	const states = components.item.default;
	const margin = tokens.metrics.screenMargin;
	const gap = tokens.spacing[3];

	const rowStyle = (pressed: boolean): StyleProp<ViewStyle> => {
		const colors = {
			...states.default,
			...(selected ? states.selected : undefined),
			...(pressed ? states.pressed : undefined),
		};
		return [
			styles.row,
			{
				minHeight: MIN_HEIGHT[size],
				gap,
				paddingHorizontal: margin,
				paddingVertical: tokens.spacing[2],
				alignItems: align === "center" ? "center" : "flex-start",
				backgroundColor: colors.background ?? "transparent",
			},
			style,
		];
	};

	const line = divider ? (
		<View
			style={[
				styles.divider,
				{
					height: tokens.metrics.hairline,
					left:
						divider === "inset" && leadingWidth > 0
							? margin + leadingWidth + gap
							: margin,
					backgroundColor: states.default.divider,
				},
			]}
		/>
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
					{...props}
					accessibilityLabel={accessibilityLabel}
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
					{...props}
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
				{...props}
				disabled={disabled}
				accessibilityLabel={accessibilityLabel}
				accessibilityRole={accessibilityRole}
				accessibilityState={a11yState}
				onPress={onPress}
				onLongPress={onLongPress}
				haptic={haptic}
				style={({ pressed }) => rowStyle(pressed)}
			>
				{children}
				{line}
			</Tappable>
		</ItemContext>
	);
}

export type ItemAreaProps = ComponentPropsWithRef<typeof View>;

function ItemLeading({ children, style, ...props }: ItemAreaProps) {
	const { setLeadingWidth } = useItem();
	const onLayout = (event: LayoutChangeEvent) => {
		setLeadingWidth(event.nativeEvent.layout.width);
		props.onLayout?.(event);
	};

	return (
		<View {...props} onLayout={onLayout} style={[styles.side, style]}>
			{children}
		</View>
	);
}

function ItemTrailing({ children, style, ...props }: ItemAreaProps) {
	const { tokens } = useTheme();
	return (
		<View {...props} style={[styles.side, { gap: tokens.spacing[2] }, style]}>
			{children}
		</View>
	);
}

function ItemContent({ children, style, ...props }: ItemAreaProps) {
	return (
		<View {...props} style={[styles.content, style]}>
			{children}
		</View>
	);
}

function ItemTitle(props: TextProps) {
	const { disabled } = useItem();
	return (
		<Text
			numberOfLines={1}
			color={disabled ? "disabled" : "default"}
			{...props}
		/>
	);
}

function ItemDescription(props: TextProps) {
	const { disabled } = useItem();
	return (
		<Text
			variant="footnote"
			numberOfLines={1}
			color={disabled ? "disabled" : "muted"}
			{...props}
		/>
	);
}

export const Item = Object.assign(ItemRoot, {
	Leading: ItemLeading,
	Content: ItemContent,
	Title: ItemTitle,
	Description: ItemDescription,
	Trailing: ItemTrailing,
});

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
