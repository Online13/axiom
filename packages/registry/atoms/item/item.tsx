import {
	createContext,
	use,
	useState,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import {
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

import { useItemStyles } from "./item.styles";

export type ItemSize = "sm" | "md" | "lg";

export type ItemAlign = "center" | "start";
export type ItemDivider = boolean | "inset";

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
	divider?: ItemDivider;
	/** Vertical alignment of leading and trailing. */
	align?: ItemAlign;
	/** Played on touch when the row is pressable. Off unless you pass a kind: a row tap is rarely an event. */
	haptic?: HapticKind | false;
	/** Merges the item into its child, for example a router `Link`. */
	asChild?: boolean;
	/** Merged with `selected` and `disabled`. */
	accessibilityState?: AccessibilityState;
	style?: StyleProp<ViewStyle>;
};

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
	...props
}: ItemProps) {
	const styles = useItemStyles();
	const [leadingWidth, setLeadingWidth] = useState(0);

	const line = divider ? (
		<View {...styles.divider(divider, leadingWidth)} />
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
					accessibilityRole={accessibilityRole}
					accessibilityState={{ ...a11yState, disabled }}
					{...styles.row(size, align, selected, props)}
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
					{...styles.row(size, align, selected, props)}
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
				{...styles.pressableRow(size, align, selected, props)}
			>
				{children}
				{line}
			</Tappable>
		</ItemContext>
	);
}

export type ItemAreaProps = ComponentPropsWithRef<typeof View>;

function ItemLeading({ children, ...props }: ItemAreaProps) {
	const styles = useItemStyles();
	const { setLeadingWidth } = useItem();
	const onLayout = (event: LayoutChangeEvent) => {
		setLeadingWidth(event.nativeEvent.layout.width);
		props.onLayout?.(event);
	};

	return (
		<View {...props} onLayout={onLayout} {...styles.leading(props)}>
			{children}
		</View>
	);
}

function ItemTrailing({ children, ...props }: ItemAreaProps) {
	const styles = useItemStyles();

	return (
		<View {...props} {...styles.trailing(props)}>
			{children}
		</View>
	);
}

function ItemContent({ children, ...props }: ItemAreaProps) {
	const styles = useItemStyles();

	return (
		<View {...props} {...styles.content(props)}>
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
