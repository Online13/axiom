import {
	createContext,
	isValidElement,
	use,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { Keyboard, View, type StyleProp, type ViewStyle } from "react-native";

import { haptic, type HapticKind } from "@/components/core/haptics";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Badge } from "@/components/ui/badge";
import type { IconName } from "@/components/ui/icons";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { useControllableState } from "@/hooks/use-controllable-state";

import {
	BottomTabBarIcon,
	useBottomTabBarStyles,
} from "./bottom-tab-bar.styles";

export type BottomTabBarVariant = "fixed" | "floating";

type BottomTabBarContextValue = {
	value: string | undefined;
	select: (value: string) => void;
};

const BottomTabBarContext = createContext<BottomTabBarContextValue | null>(
	null,
);

function useBottomTabBar() {
	const context = use(BottomTabBarContext);
	if (!context)
		throw new Error("BottomTabBar.Item must be used inside <BottomTabBar>.");
	return context;
}

export type BottomTabBarProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	/** Value of the active item. Keep it aligned with the current route name. */
	value?: string;
	defaultValue?: string;
	/** Called when a different enabled item is pressed: where a router adapter navigates. */
	onValueChange?: (value: string) => void;
	/** Pinned to the screen edge, or an inset pill. */
	variant?: BottomTabBarVariant;
	/** Played when the user switches to another item. Off unless you pass a kind, e.g. `"selection"`. */
	haptic?: HapticKind | false;
	safeArea?: boolean;
	/** Two to five `BottomTabBar.Item` elements, and a `BottomTabBar.Action` where you want it. */
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

function BottomTabBarRoot({
	value: valueProp,
	defaultValue,
	onValueChange,
	variant = "fixed",
	haptic: hapticKind,
	safeArea = true,
	children,
	...props
}: BottomTabBarProps) {
	const styles = useBottomTabBarStyles();
	const [value, setValue] = useControllableState({
		value: valueProp,
		defaultValue: defaultValue ?? "",
		onChange: onValueChange,
	});

	const select = (next: string) => {
		if (next === value) return;
		if (hapticKind) haptic(hapticKind);
		Keyboard.dismiss();
		setValue(next);
	};

	return (
		<BottomTabBarContext value={{ value, select }}>
			<View
				{...props}
				accessibilityRole="tablist"
				{...styles.bar(variant, safeArea, props)}
			>
				{children}
			</View>
		</BottomTabBarContext>
	);
}

export type BottomTabBarActionProps = ComponentPropsWithRef<typeof View>;

/** A raised action among the items, such as a compose button. It performs an action and is never the selected tab. */
function BottomTabBarAction(props: BottomTabBarActionProps) {
	const styles = useBottomTabBarStyles();

	return <View {...props} {...styles.action(props)} />;
}

export type BottomTabBarItemProps = Omit<
	TappableProps,
	"children" | "style" | "disabled" | "onPress"
> & {
	/** Stable value used by the root to identify this destination. */
	value: string;
	/** Short destination name, under the icon. */
	label: string;
	icon: IconName | ReactNode;
	/** A filled or heavier icon for the active state. */
	activeIcon?: IconName | ReactNode;
	/** Count, short text or dot. Counts above 99 show as `99+`. */
	badge?: number | string | boolean;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
};

function BottomTabBarItem({
	value,
	label,
	icon,
	activeIcon,
	badge,
	disabled = false,
	accessibilityLabel,
	...props
}: BottomTabBarItemProps) {
	const styles = useBottomTabBarStyles();
	const bar = useBottomTabBar();

	const active = bar.value === value;
	const glyph = (active ? (activeIcon ?? icon) : icon) as IconName | ReactNode;

	return (
		<Tappable
			{...props}
			accessibilityRole="tab"
			accessibilityLabel={accessibilityLabel ?? label}
			accessibilityState={{ selected: active, disabled }}
			disabled={disabled}
			onPress={() => bar.select(value)}
			{...styles.item(props)}
		>
			<WithBadge badge={badge} label={label}>
				{isValidElement(glyph) ? (
					glyph
				) : (
					<BottomTabBarIcon
						name={glyph as IconName}
						size="md"
						{...styles.tint(active, disabled)}
					/>
				)}
			</WithBadge>
			<Text
				variant="caption"
				maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
				numberOfLines={1}
				{...styles.label(active, disabled)}
			>
				{label}
			</Text>
		</Tappable>
	);
}

/** A number becomes a counter, a string a short label, `true` a lone dot. No badge, no wrapper. */
function WithBadge({
	badge,
	label,
	children,
}: {
	badge: number | string | boolean | undefined;
	label: string;
	children: ReactNode;
}) {
	if (badge === undefined || badge === false || badge === 0)
		return <>{children}</>;

	const element =
		badge === true ? (
			<Badge dot accessibilityLabel={`${label}, new content`} />
		) : typeof badge === "number" ? (
			<Badge count={badge} accessibilityLabel={`${label}, ${badge} new`} />
		) : (
			<Badge size="sm">{badge}</Badge>
		);

	return <Badge.Anchor badge={element}>{children}</Badge.Anchor>;
}

export const BottomTabBar = Object.assign(BottomTabBarRoot, {
	Item: BottomTabBarItem,
	Action: BottomTabBarAction,
});
