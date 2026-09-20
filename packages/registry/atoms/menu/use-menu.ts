import {
	createContext,
	use,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from "react";
import {
	useWindowDimensions,
	type LayoutChangeEvent,
	type View,
} from "react-native";
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import { useControllableState } from "@/hooks/use-controllable-state";
import { useOverlayBackHandler } from "@/hooks/use-overlay-back-handler";

export type Rect = { x: number; y: number; width: number; height: number };

export type UseMenuOptions = {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
};

/** Open state, the trigger position and the preview, shared by every part of a menu. */
export function useMenu({
	open,
	defaultOpen = false,
	onOpenChange,
}: UseMenuOptions) {
	const [current, setOpen] = useControllableState({
		value: open,
		defaultValue: defaultOpen,
		onChange: onOpenChange,
	});
	const [anchor, setAnchor] = useState<Rect | null>(null);
	const [preview, setPreview] = useState<ReactNode>(null);
	// An item's `onPress` runs once the menu has closed, so a navigation doesn't fight the animation.
	const pending = useRef<(() => void) | null>(null);
	const triggerRef = useRef<View>(null);

	const openFromTrigger = (nextPreview: ReactNode) => {
		const node = triggerRef.current;
		if (!node) return;
		node.measureInWindow((x, y, width, height) => {
			setAnchor({ x, y, width, height });
			setPreview(nextPreview);
			setOpen(true);
		});
	};

	const select = (callback?: () => void) => {
		pending.current = callback ?? null;
		setOpen(false);
	};

	const flush = () => {
		const callback = pending.current;
		pending.current = null;
		callback?.();
	};

	return {
		open: current,
		setOpen,
		anchor,
		preview,
		triggerRef,
		openFromTrigger,
		select,
		flush,
	};
}

export type MenuContextValue = ReturnType<typeof useMenu>;

export const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenuContext() {
	const context = use(MenuContext);
	if (!context)
		throw new Error("Menu parts must be rendered inside Menu.Root.");
	return context;
}

export type MenuPlacement = "auto" | "top" | "bottom";

export type UseMenuContentOptions = {
	placement?: MenuPlacement;
	align?: "start" | "center" | "end";
	width?: number;
	/** Distance between the trigger and the menu. */
	gap: number;
	/** Minimum distance from the screen edges. */
	margin: number;
};

/** Position next to the trigger, inside the safe area, and the enter and exit animation. */
export function useMenuContent({
	placement = "auto",
	align = "start",
	width = 250,
	gap,
	margin,
}: UseMenuContentOptions) {
	const menu = useMenuContext();
	const { width: screenWidth, height: screenHeight } = useWindowDimensions();
	const insets = useSafeAreaInsets();
	const [mounted, setMounted] = useState(menu.open);
	const [height, setHeight] = useState<number | null>(null);
	if (menu.open && !mounted) setMounted(true);

	const progress = useSharedValue(0);

	useOverlayBackHandler(menu.open, () => menu.setOpen(false));

	useEffect(() => {
		if (!mounted) return;
		const finish = () => {
			setMounted(false);
			setHeight(null);
			menu.flush();
		};
		if (!menu.open) {
			// Closed before it was measured: nothing to animate.
			if (height === null) finish();
			else
				progress.value = withTiming(0, { duration: 150 }, (finished) => {
					if (finished) scheduleOnRN(finish);
				});
			return;
		}
		if (height !== null)
			progress.value = withSpring(1, {
				stiffness: 500,
				damping: 36,
				mass: 1,
			});
		// Only `open` and the first measure start an animation.
	}, [menu.open, mounted, height === null]);

	const anchor = menu.anchor ?? {
		x: screenWidth / 2,
		y: screenHeight / 2,
		width: 0,
		height: 0,
	};
	const menuWidth = Math.min(width, screenWidth - margin * 2);
	const top = insets.top + margin;
	const bottom = screenHeight - insets.bottom - margin;
	const below = bottom - (anchor.y + anchor.height + gap);
	const above = anchor.y - gap - top;
	const measured = height ?? 0;

	const side =
		placement === "auto"
			? below >= measured || below >= above
				? "bottom"
				: "top"
			: placement;
	const rawTop =
		side === "bottom"
			? anchor.y + anchor.height + gap
			: anchor.y - gap - measured;
	const rawLeft =
		align === "start"
			? anchor.x
			: align === "end"
				? anchor.x + anchor.width - menuWidth
				: anchor.x + (anchor.width - menuWidth) / 2;

	const position = {
		top: Math.max(top, Math.min(rawTop, bottom - measured)),
		left: Math.max(
			margin,
			Math.min(rawLeft, screenWidth - margin - menuWidth),
		),
		width: menuWidth,
		maxHeight: bottom - top,
	};

	const onLayout = (event: LayoutChangeEvent) => {
		const next = event.nativeEvent.layout.height;
		setHeight((previous) => (previous === next ? previous : next));
	};

	const menuStyle = useAnimatedStyle(() => ({
		opacity: height === null ? 0 : Math.min(1, progress.value * 2),
		transform: [{ scale: 0.5 + progress.value * 0.5 }],
	}));

	// Grows from the corner closest to the trigger.
	const transformOrigin = `${align === "start" ? "left" : align === "end" ? "right" : "center"} ${side === "bottom" ? "top" : "bottom"}`;

	const previewStyle = useAnimatedStyle(() => ({
		transform: [{ scale: 1 + progress.value * 0.03 }],
	}));

	return {
		mounted,
		open: menu.open,
		close: () => menu.setOpen(false),
		anchor,
		position,
		transformOrigin,
		onLayout,
		menuStyle,
		previewStyle,
	};
}
