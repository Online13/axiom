import {
	createContext,
	isValidElement,
	use,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { Keyboard, View, type StyleProp, type ViewStyle } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { haptic, type HapticKind } from "@/components/core/haptics";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { MAX_FONT_SCALE, Text } from "@/components/ui/text";
import { useControllableState } from "@/hooks/use-controllable-state";
import type { Theme } from "@/theme";

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

function itemColors(
	components: Theme["components"],
	active: boolean,
	disabled: boolean,
) {
	const states = components.bottomTabBar.item;
	return {
		...states.default,
		...(disabled ? states.disabled : active ? states.active : undefined),
	};
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

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
	style,
	...props
}: BottomTabBarProps) {
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
				style={[styles.bar(variant, safeArea), style]}
			>
				{children}
			</View>
		</BottomTabBarContext>
	);
}

export type BottomTabBarActionProps = ComponentPropsWithRef<typeof View>;

/** A raised action among the items, such as a compose button. It performs an action and is never the selected tab. */
function BottomTabBarAction({ style, ...props }: BottomTabBarActionProps) {
	return <View {...props} style={[styles.action, style]} />;
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
	style,
	...props
}: BottomTabBarItemProps) {
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
			style={[styles.item, style]}
		>
			<WithBadge badge={badge} label={label}>
				{isValidElement(glyph) ? (
					glyph
				) : (
					<ThemedIcon
						name={glyph as IconName}
						size="md"
						uniProps={(theme) => ({
							color: itemColors(theme.components, active, disabled)
								.content,
						})}
					/>
				)}
			</WithBadge>
			<Text
				variant="caption"
				maxFontSizeMultiplier={MAX_FONT_SCALE.fixed}
				numberOfLines={1}
				style={styles.label(active, disabled)}
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

const styles = StyleSheet.create((theme, rt) => ({
	bar: (variant: BottomTabBarVariant, safeArea: boolean) => {
		const floating = variant === "floating";
		const colors = theme.components.bottomTabBar[variant].default;

		return {
			flexDirection: "row",
			alignItems: floating ? "center" : "flex-end",
			...(floating
				? {
						borderWidth: StyleSheet.hairlineWidth,
						borderCurve: "continuous",
					}
				: { borderTopWidth: StyleSheet.hairlineWidth }),
			paddingTop: theme.tokens.spacing[1],
			paddingBottom: floating
				? theme.tokens.spacing[1]
				: theme.tokens.spacing[1] + (safeArea ? rt.insets.bottom : 0),
			paddingHorizontal: theme.tokens.spacing[1],
			backgroundColor: colors.background,
			borderColor: colors.border,
			borderRadius: floating ? theme.tokens.radius.xl : 0,
			marginHorizontal: floating ? theme.tokens.metrics.screenMargin : 0,
			marginBottom:
				floating && safeArea
					? rt.insets.bottom + theme.tokens.spacing[2]
					: 0,
		};
	},
	item: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		minHeight: theme.tokens.metrics.touchTarget,
		paddingVertical: theme.tokens.spacing[1],
		gap: 2,
	},
	label: (active: boolean, disabled: boolean) => ({
		color: itemColors(theme.components, active, disabled).content,
	}),
	action: {
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 4,
	},
}));
