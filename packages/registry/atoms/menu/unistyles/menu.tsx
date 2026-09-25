import { createContext, use, useState, type ReactNode } from "react";
import {
	ScrollView,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import {
	StyleSheet,
	useUnistyles,
	withUnistyles,
} from "react-native-unistyles";

import { Overlay } from "@/components/core/overlay";
import { Portal } from "@/components/core/portal";
import { Slot } from "@/components/core/slot";
import { haptic, type HapticKind } from "@/components/core/haptics";
import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Text } from "@/components/ui/text";
import type { Theme } from "@/theme";

import {
	MenuContext,
	useMenu,
	useMenuContent,
	useMenuContext,
	type MenuPlacement,
	type UseMenuOptions,
} from "../use-menu";

export type MenuRootProps = UseMenuOptions & { children?: ReactNode };

function MenuRoot({ children, ...options }: MenuRootProps) {
	const menu = useMenu(options);
	return <MenuContext value={menu}>{children}</MenuContext>;
}

export type MenuTriggerProps = {
	/** `longPress` for context menus on content, `press` for a "more" button. */
	action?: "longPress" | "press";
	/** Lifts a copy of the trigger above the backdrop. A node shows that node in its place instead. */
	preview?: boolean | ReactNode;
	/** Played when the menu opens. Defaults to `medium` for a long press, nothing for a press. `false` turns it off. */
	haptic?: HapticKind | false;
	asChild?: boolean;
	accessibilityLabel?: string;
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

function MenuTrigger({
	action = "longPress",
	preview,
	haptic: hapticKind = action === "longPress" ? "medium" : false,
	asChild = false,
	accessibilityLabel,
	children,
	style,
}: MenuTriggerProps) {
	const { triggerRef, openFromTrigger } = useMenuContext();
	const lifted = preview ?? action === "longPress";
	const previewNode =
		lifted === true ? children : lifted === false ? null : lifted;
	const open = () => {
		if (hapticKind) haptic(hapticKind);
		openFromTrigger(previewNode);
	};
	const handlers =
		action === "press" ? { onPress: open } : { onLongPress: open };

	if (asChild) {
		return (
			<View ref={triggerRef} collapsable={false} style={style}>
				<Slot {...handlers}>{children}</Slot>
			</View>
		);
	}

	return (
		<Tappable
			ref={triggerRef}
			{...handlers}
			accessibilityLabel={accessibilityLabel}
			// Screen readers reach a long-press menu through the long press action.
			accessibilityHint={
				action === "longPress" ? "Long press for options" : undefined
			}
			style={style}
		>
			{children}
		</Tappable>
	);
}

// A submenu replaces the items in place; its parents stay in this stack.
type MenuStack = { push: (label: string, items: ReactNode) => void };
const StackContext = createContext<MenuStack | null>(null);

function menuItemColors(
	components: Theme["components"],
	destructive: boolean,
	disabled: boolean,
) {
	const states = components.menu.default;
	return {
		...states.default,
		...(destructive ? states.destructive : undefined),
		...(disabled ? states.disabled : undefined),
	};
}

// The icon takes its color as a prop, not as a style. Wrapped once, here, so each instance only has
// to map the theme to that prop through `uniProps`.
const ThemedIcon = withUnistyles(Icon);

export type MenuContentProps = {
	placement?: MenuPlacement;
	align?: "start" | "center" | "end";
	width?: number;
	/** Backdrop behind the menu. Pressing it closes the menu. */
	overlay?: "dim" | "none";
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

function MenuContent({
	placement,
	align,
	width,
	overlay = "dim",
	children,
	style,
}: MenuContentProps) {
	// The placement is computed in plain numbers, so the spacing tokens are read here rather than
	// resolved by the shadow tree. This is the theme-in-logic case.
	const { theme } = useUnistyles();
	const menu = useMenuContext();
	const content = useMenuContent({
		placement,
		align,
		width,
		gap: theme.tokens.spacing[2],
		margin: theme.tokens.metrics.screenMargin,
	});
	const [stack, setStack] = useState<{ label: string; items: ReactNode }[]>(
		[],
	);

	if (!content.mounted) {
		if (stack.length > 0) setStack([]);
		return null;
	}

	const top = stack[stack.length - 1];

	return (
		<Portal>
			<View
				importantForAccessibility={
					content.isTop ? "auto" : "no-hide-descendants"
				}
				style={[styles.layer, !content.isTop && styles.inert]}
			>
				<Overlay
					visible={content.open}
					onPress={content.close}
					opacity={overlay === "none" ? 0 : 0.25}
				/>
				{menu.preview !== null && menu.preview !== undefined ? (
					<Animated.View
						style={[
							styles.preview(
								content.anchor.x,
								content.anchor.y,
								content.anchor.width,
							),
							content.previewStyle,
						]}
					>
						{menu.preview}
					</Animated.View>
				) : null}
				<Animated.View
					accessibilityViewIsModal={content.isTop}
					accessibilityRole="menu"
					onLayout={content.onLayout}
					style={[
						styles.menu(content.transformOrigin),
						content.position,
						style,
						content.menuStyle,
					]}
				>
					<ScrollView bounces={false} showsVerticalScrollIndicator={false}>
						<StackContext
							value={{
								push: (label, items) =>
									setStack((previous) => [
										...previous,
										{ label, items },
									]),
							}}
						>
							{top ? (
								<>
									<MenuItem
										icon="arrow-left"
										keepOpen
										onPress={() =>
											setStack((previous) => previous.slice(0, -1))
										}
									>
										{top.label}
									</MenuItem>
									<MenuSeparator />
									{top.items}
								</>
							) : (
								children
							)}
						</StackContext>
					</ScrollView>
				</Animated.View>
			</View>
		</Portal>
	);
}

export type MenuItemProps = {
	children: string;
	/** Icon on the right, iOS style. */
	icon?: IconName;
	subtitle?: string;
	/** Called after the menu closes. */
	onPress?: () => void;
	destructive?: boolean;
	disabled?: boolean;
	/** Shows a checkmark, for a menu that picks a sort order or a view. */
	checked?: boolean;
	/** Runs `onPress` without closing the menu. */
	keepOpen?: boolean;
};

function MenuItem({
	children,
	icon,
	subtitle,
	onPress,
	destructive = false,
	disabled = false,
	checked,
	keepOpen = false,
}: MenuItemProps) {
	const menu = useMenuContext();
	const foreground = (uniTheme: Theme) => ({
		color: menuItemColors(uniTheme.components, destructive, disabled)
			.foreground,
	});

	return (
		<Tappable
			disabled={disabled}
			accessibilityRole="menuitem"
			accessibilityLabel={subtitle ? `${children}, ${subtitle}` : children}
			accessibilityState={checked === undefined ? undefined : { checked }}
			onPress={() => (keepOpen ? onPress?.() : menu.select(onPress))}
			style={({ pressed }) => styles.item(pressed)}
		>
			{checked !== undefined ? (
				<View style={styles.check}>
					{checked ? (
						<ThemedIcon
							name="check"
							size="sm"
							uniProps={foreground}
						/>
					) : null}
				</View>
			) : null}
			<View style={styles.label}>
				<Text
					numberOfLines={1}
					style={styles.itemText(destructive, disabled)}
				>
					{children}
				</Text>
				{subtitle ? (
					<Text
						variant="footnote"
						color={disabled ? "disabled" : "muted"}
						numberOfLines={2}
					>
						{subtitle}
					</Text>
				) : null}
			</View>
			{icon ? <ThemedIcon name={icon} uniProps={foreground} /> : null}
		</Tappable>
	);
}

export type MenuSubProps = {
	label: string;
	icon?: IconName;
	/** The items of the nested menu. */
	children?: ReactNode;
};

/** An item that opens a nested menu in place. */
function MenuSub({ label, icon, children }: MenuSubProps) {
	const stack = use(StackContext);

	return (
		<MenuItem
			icon={icon ?? "chevron-right"}
			keepOpen
			onPress={() => stack?.push(label, children)}
		>
			{label}
		</MenuItem>
	);
}

function MenuGroup({
	label,
	children,
}: {
	label?: string;
	children?: ReactNode;
}) {
	return (
		<View>
			{label ? (
				<Text variant="footnote" color="muted" style={styles.groupLabel}>
					{label}
				</Text>
			) : null}
			{children}
		</View>
	);
}

/** A thick gap between groups, like iOS. */
function MenuSeparator() {
	return <View style={styles.separator} />;
}

export const Menu = {
	Root: MenuRoot,
	Trigger: MenuTrigger,
	Content: MenuContent,
	Item: MenuItem,
	Sub: MenuSub,
	Group: MenuGroup,
	Separator: MenuSeparator,
};

const styles = StyleSheet.create((theme) => ({
	layer: StyleSheet.absoluteFillObject,
	// Covered by a surface opened over it: it keeps its place but stops answering.
	inert: {
		pointerEvents: "none",
	},
	preview: (x: number, y: number, width: number) => ({
		position: "absolute",
		pointerEvents: "none",
		top: y,
		left: x,
		width,
	}),
	menu: (transformOrigin: string) => ({
		position: "absolute",
		overflow: "hidden",
		boxShadow: "0px 8px 32px hsla(0, 0%, 0%, 0.2)",
		transformOrigin,
		borderRadius: theme.tokens.radius.lg,
		backgroundColor: theme.components.menu.default.default.background,
	}),
	item: (pressed: boolean) => ({
		flexDirection: "row",
		alignItems: "center",
		minHeight: theme.tokens.metrics.touchTarget,
		gap: theme.tokens.spacing[3],
		paddingHorizontal: theme.tokens.spacing[4],
		paddingVertical: theme.tokens.spacing[2] + 2,
		backgroundColor: pressed
			? theme.components.menu.default.pressed?.item
			: undefined,
	}),
	itemText: (destructive: boolean, disabled: boolean) => ({
		color: menuItemColors(theme.components, destructive, disabled)
			.foreground,
	}),
	check: {
		width: 16,
		alignItems: "center",
	},
	label: {
		flex: 1,
		gap: 2,
	},
	groupLabel: {
		paddingHorizontal: theme.tokens.spacing[4],
		paddingTop: theme.tokens.spacing[2],
		paddingBottom: theme.tokens.spacing[1],
	},
	separator: {
		height: theme.tokens.spacing[2],
		backgroundColor: theme.components.menu.default.default.separator,
	},
}));
