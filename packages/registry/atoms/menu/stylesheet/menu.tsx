import {
	createContext,
	use,
	useState,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
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
import { composeRefs, Slot } from "@/components/core/slot";
import { haptic, type HapticKind } from "@/components/core/haptics";
import { Tappable, type TappableProps } from "@/components/core/tappable";
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

export type MenuTriggerProps = Omit<
	TappableProps,
	"children" | "style" | "onPress"
> & {
	/** Played when the menu opens. Off unless you pass a kind. */
	haptic?: HapticKind | false;
	asChild?: boolean;
	children?: ReactNode;
	style?: StyleProp<ViewStyle>;
};

/** Opens the menu on a press, like a "more" button. For a long press on content, see ContextMenu. */
function MenuTrigger({
	haptic: hapticKind,
	asChild = false,
	children,
	style,
	ref,
	...props
}: MenuTriggerProps) {
	const { triggerRef, openFromTrigger } = useMenuContext();
	const open = () => {
		if (hapticKind) haptic(hapticKind);
		openFromTrigger(null);
	};

	if (asChild) {
		return (
			<View
				{...props}
				ref={composeRefs(triggerRef, ref)}
				collapsable={false}
				style={style}
			>
				<Slot onPress={open}>{children}</Slot>
			</View>
		);
	}

	return (
		<Tappable
			{...props}
			ref={composeRefs(triggerRef, ref)}
			onPress={open}
			style={style}
		>
			{children}
		</Tappable>
	);
}

// A submenu replaces the items in place; its parents stay in this stack.
type MenuStack = { push: (label: string, items: ReactNode) => void };
const StackContext = createContext<MenuStack | null>(null);

export type MenuContentProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
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
	onLayout,
	...props
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
				{/* Set by ContextMenu.Trigger: the pressed content, lifted above the backdrop. */}
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
					{...props}
					accessibilityViewIsModal={content.isTop}
					accessibilityRole="menu"
					onLayout={(event) => {
						content.onLayout(event);
						onLayout?.(event);
					}}
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

export type MenuItemProps = Omit<
	TappableProps,
	"children" | "style" | "disabled" | "onPress"
> & {
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
	style?: StyleProp<ViewStyle>;
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
	style,
	...props
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
			{...props}
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
				style,
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

export type MenuSubProps = Omit<
	MenuItemProps,
	"children" | "onPress" | "keepOpen" | "checked"
> & {
	label: string;
	/** The items of the nested menu. */
	children?: ReactNode;
};

/** An item that opens a nested menu in place. */
function MenuSub({ label, icon, children, ...props }: MenuSubProps) {
	const stack = use(StackContext);

	return (
		<MenuItem
			{...props}
			icon={icon ?? "chevron-right"}
			keepOpen
			onPress={() => stack?.push(label, children)}
		>
			{label}
		</MenuItem>
	);
}

export type MenuGroupProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
> & {
	label?: string;
	children?: ReactNode;
};

function MenuGroup({ label, children, ...props }: MenuGroupProps) {
	const { tokens } = useTheme();

	return (
		<View {...props}>
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
export type MenuSeparatorProps = Omit<
	ComponentPropsWithRef<typeof View>,
	"children"
>;

function MenuSeparator({ style, ...props }: MenuSeparatorProps) {
	const { tokens, components } = useTheme();
	return (
		<View
			{...props}
			style={[
				{
					height: tokens.spacing[2],
					backgroundColor: components.menu.default.default.separator,
				},
				style,
			]}
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
