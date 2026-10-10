import {
	createContext,
	use,
	useState,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import { ScrollView, View, type StyleProp, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

import { Overlay } from "@/components/core/overlay";
import { Portal } from "@/components/core/portal";
import { composeRefs, Slot } from "@/components/core/slot";
import { haptic, type HapticKind } from "@/components/core/haptics";
import { Tappable, type TappableProps } from "@/components/core/tappable";
import type { IconName } from "@/components/ui/icons";
import { Text } from "@/components/ui/text";

import { MenuIcon, MenuSurface, useMenuStyles } from "./menu.styles";

import {
	MenuContext,
	useMenu,
	useMenuContent,
	useMenuContext,
	type MenuPlacement,
	type UseMenuOptions,
} from "./use-menu";

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
	const styles = useMenuStyles();
	const menu = useMenuContext();
	const content = useMenuContent({
		placement,
		align,
		width,
		gap: styles.gap,
		margin: styles.margin,
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
				{...styles.layer(content.isTop)}
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
				<MenuSurface
					{...props}
					accessibilityViewIsModal={content.isTop}
					accessibilityRole="menu"
					onLayout={(event) => {
						content.onLayout(event);
						onLayout?.(event);
					}}
					{...styles.surface}
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
				</MenuSurface>
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
	...props
}: MenuItemProps) {
	const styles = useMenuStyles();
	const menu = useMenuContext();

	return (
		<Tappable
			{...props}
			disabled={disabled}
			accessibilityRole="menuitem"
			accessibilityLabel={subtitle ? `${children}, ${subtitle}` : children}
			accessibilityState={checked === undefined ? undefined : { checked }}
			onPress={() => (keepOpen ? onPress?.() : menu.select(onPress))}
			{...styles.item(props)}
		>
			{checked !== undefined ? (
				<View {...styles.check}>
					{checked ? (
						<MenuIcon
							name="check"
							size="sm"
							{...styles.tint(destructive, disabled)}
						/>
					) : null}
				</View>
			) : null}
			<View {...styles.label}>
				<Text numberOfLines={1} {...styles.itemText(destructive, disabled)}>
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
			{icon ? (
				<MenuIcon name={icon} {...styles.tint(destructive, disabled)} />
			) : null}
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
	const styles = useMenuStyles();

	return (
		<View {...props}>
			{label ? (
				<Text variant="footnote" color="muted" {...styles.groupLabel}>
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

function MenuSeparator(props: MenuSeparatorProps) {
	const styles = useMenuStyles();

	return <View {...props} {...styles.separator(props)} />;
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
