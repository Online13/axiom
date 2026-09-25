import { createContext, use, useState, type ReactNode } from "react";
import {
	ScrollView,
	StyleSheet,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

import { Overlay } from "@/components/core/overlay";
import { Portal } from "@/components/core/portal";
import { Slot } from "@/components/core/slot";
import { haptic, type HapticKind } from "@/components/core/haptics";
import { Tappable } from "@/components/core/tappable";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/components/ui/icons";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/theme";

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
	const { tokens, components } = useTheme();
	const menu = useMenuContext();
	const content = useMenuContent({
		placement,
		align,
		width,
		gap: tokens.spacing[2],
		margin: tokens.metrics.screenMargin,
	});
	const [stack, setStack] = useState<{ label: string; items: ReactNode }[]>(
		[],
	);

	if (!content.mounted) {
		if (stack.length > 0) setStack([]);
		return null;
	}

	const colors = components.menu.default.default;
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
							styles.preview,
							{
								top: content.anchor.y,
								left: content.anchor.x,
								width: content.anchor.width,
							},
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
						styles.menu,
						content.position,
						{
							transformOrigin: content.transformOrigin,
							borderRadius: tokens.radius.lg,
							backgroundColor: colors.background,
						},
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
	const { tokens, components } = useTheme();
	const menu = useMenuContext();
	const states = components.menu.default;
	const colors = {
		...states.default,
		...(destructive ? states.destructive : undefined),
		...(disabled ? states.disabled : undefined),
	};

	return (
		<Tappable
			disabled={disabled}
			accessibilityRole="menuitem"
			accessibilityLabel={subtitle ? `${children}, ${subtitle}` : children}
			accessibilityState={checked === undefined ? undefined : { checked }}
			onPress={() => (keepOpen ? onPress?.() : menu.select(onPress))}
			style={({ pressed }) => [
				styles.item,
				{
					minHeight: tokens.metrics.touchTarget,
					gap: tokens.spacing[3],
					paddingHorizontal: tokens.spacing[4],
					paddingVertical: tokens.spacing[2] + 2,
					backgroundColor: pressed ? states.pressed?.item : undefined,
				},
			]}
		>
			{checked !== undefined ? (
				<View style={styles.check}>
					{checked ? (
						<Icon name="check" size="sm" color={colors.foreground} />
					) : null}
				</View>
			) : null}
			<View style={styles.label}>
				<Text numberOfLines={1} style={{ color: colors.foreground }}>
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
			{icon ? <Icon name={icon} color={colors.foreground} /> : null}
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
	const { tokens } = useTheme();

	return (
		<View>
			{label ? (
				<Text
					variant="footnote"
					color="muted"
					style={{
						paddingHorizontal: tokens.spacing[4],
						paddingTop: tokens.spacing[2],
						paddingBottom: tokens.spacing[1],
					}}
				>
					{label}
				</Text>
			) : null}
			{children}
		</View>
	);
}

/** A thick gap between groups, like iOS. */
function MenuSeparator() {
	const { tokens, components } = useTheme();
	return (
		<View
			style={{
				height: tokens.spacing[2],
				backgroundColor: components.menu.default.default.separator,
			}}
		/>
	);
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

const styles = StyleSheet.create({
	layer: {
		...StyleSheet.absoluteFill,
	},
	// Covered by a surface opened over it: it keeps its place but stops answering.
	inert: {
		pointerEvents: "none",
	},
	preview: {
		position: "absolute",
		pointerEvents: "none",
	},
	menu: {
		position: "absolute",
		overflow: "hidden",
		boxShadow: "0px 8px 32px hsla(0, 0%, 0%, 0.2)",
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
	},
	check: {
		width: 16,
		alignItems: "center",
	},
	label: {
		flex: 1,
		gap: 2,
	},
});
