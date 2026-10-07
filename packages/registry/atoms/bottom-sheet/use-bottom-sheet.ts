import {
	createContext,
	use,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useWindowDimensions, type LayoutChangeEvent } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import Animated, {
	Extrapolation,
	interpolate,
	scrollTo,
	useAnimatedReaction,
	useAnimatedRef,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import {
	KeyboardController,
	useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import { haptic, type HapticKind } from "@/components/core/haptics";
import { useOverlayStack } from "@/components/core/overlay-stack";
import { useOverlayBackHandler } from "@/hooks/use-overlay-back-handler";

import { useBottomSheet } from "./bottom-sheet-root";

/** Points (`320`), a percentage of the screen (`'50%'`), or `'content'` to fit the children. */
export type SnapPoint = number | `${number}%` | "content";

/**
 * - `interactive`: the sheet rises with the keyboard, frame by frame.
 * - `extend`: same, and the sheet also moves to its highest snap point.
 * - `none`: the sheet stays where it is.
 */
export type KeyboardBehavior = "interactive" | "extend" | "none";

export type UseBottomSheetContentOptions = {
	snapPoints?: SnapPoint[];
	/** Controlled snap point. */
	index?: number;
	onIndexChange?: (index: number) => void;
	/** Closes on swipe down, backdrop press and back button. */
	dismissible?: boolean;
	/** Called after the close animation ends. */
	onDismiss?: () => void;
	/** Distance between the bottom of the sheet and the bottom of the screen, for a detached sheet. */
	bottomOffset?: number;
	/** How the sheet reacts when an input inside it opens the keyboard. */
	keyboardBehavior?: KeyboardBehavior;
	/** Scales the sheet underneath when this one opens over it. `false` opens over it untouched. */
	stack?: boolean;
	/** How far a covered sheet shrinks per level. From `tokens.metrics.stackScale`. */
	stackScale?: number;
	/**
	 * Played when a drag lands the sheet on another snap point. Opening, closing and `index` changes
	 * made in code don't play it. Off unless you pass a kind, e.g. `"light"`.
	 */
	haptic?: HapticKind | false;
};

// Critically damped: settles fast without bouncing.
const SPRING = { stiffness: 400, damping: 40, mass: 1 };
// How far the release velocity carries the sheet, in seconds, when picking the snap point.
const VELOCITY_PROJECTION = 0.1;

/** Snap points, gesture, animation and back button of a bottom sheet, shared by every styling variant. */
export function useBottomSheetContent({
	snapPoints = ["content"],
	index: controlledIndex,
	onIndexChange,
	dismissible = true,
	onDismiss,
	bottomOffset = 0,
	keyboardBehavior = "interactive",
	stack = true,
	stackScale = 1,
	haptic: hapticKind,
}: UseBottomSheetContentOptions) {
	const { open, setOpen } = useBottomSheet();
	const { depth, isTop } = useOverlayStack(open, stack);
	const { height: screenHeight } = useWindowDimensions();
	const insets = useSafeAreaInsets();

	const [mounted, setMounted] = useState(open);
	if (open && !mounted) setMounted(true);

	const [uncontrolledIndex, setUncontrolledIndex] = useState(
		controlledIndex ?? 0,
	);
	const index = Math.min(
		controlledIndex ?? uncontrolledIndex,
		snapPoints.length - 1,
	);

	const [contentHeight, setContentHeight] = useState<number | null>(null);
	const [footerHeight, setFooterHeight] = useState(0);
	// Bumped when a close was refused by the owner, so the sheet goes back to its snap point.
	const [restore, setRestore] = useState(0);

	const fitsContent = snapPoints.includes("content");
	const ready = !fitsContent || contentHeight !== null;
	const maxHeight = screenHeight - insets.top - bottomOffset;

	const heights = snapPoints.map((point) => {
		const height =
			point === "content"
				? (contentHeight ?? 0)
				: typeof point === "number"
					? point
					: (screenHeight * parseFloat(point)) / 100;
		return Math.min(height, maxHeight);
	});
	const sheetHeight = ready ? Math.max(...heights) : maxHeight;
	// translateY of the sheet for each snap point, and when closed.
	const snapPositions = heights.map((height) => sheetHeight - height);
	const closedPosition = sheetHeight + bottomOffset;

	const translateY = useSharedValue(screenHeight);
	const positions = useSharedValue(snapPositions);
	const closed = useSharedValue(closedPosition);
	const canDismiss = useSharedValue(dismissible);
	const isReady = useSharedValue(false);
	const start = useSharedValue(0);

	// Receding under another sheet. Depth only changes when a sheet opens or closes, so this is a
	// spring started by that change, not a value tracked frame by frame from the sheet above.
	const coveredScale = useSharedValue(1);

	// The keyboard covers the bottom safe area, so the sheet only rises by what's above it.
	const keyboard = useReanimatedKeyboardAnimation();
	const followsKeyboard = useSharedValue(keyboardBehavior !== "none");
	const safeBottom = useSharedValue(insets.bottom);
	const topLimit = useSharedValue(maxHeight - sheetHeight);

	// Scrollable content (BottomSheet.ScrollView) takes the gesture back when it isn't at the top.
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useSharedValue(0);
	const hasScroll = useSharedValue(false);

	// Called from the UI thread, these read the latest render: stable functions, current values.
	const requestIndex = useLatestCallback((next: number) => {
		if (controlledIndex === undefined) setUncontrolledIndex(next);
		if (next !== index) onIndexChange?.(next);
	});

	// The end of a drag, the only snap change that plays the haptic.
	const settleFromDrag = useLatestCallback((next: number) => {
		if (hapticKind && next !== index) haptic(hapticKind);
		requestIndex(next);
	});

	const requestClose = useLatestCallback(() => setOpen(false));

	const onClosed = useLatestCallback(() => {
		if (open) {
			// The owner kept the sheet open: go back to the current snap point.
			setRestore((value) => value + 1);
			return;
		}
		setMounted(false);
		setContentHeight(null);
		onDismiss?.();
	});

	const wasOpen = useRef(false);
	const positionsKey = snapPositions.join(",");

	useEffect(() => {
		positions.set(snapPositions);
		closed.set(closedPosition);
		canDismiss.set(dismissible);
		followsKeyboard.set(keyboardBehavior !== "none");
		safeBottom.set(insets.bottom);
		topLimit.set(maxHeight - sheetHeight);
		isReady.set(mounted && ready);
		if (!mounted || !ready) return;

		if (open) {
			if (!wasOpen.current) {
				translateY.set(closedPosition);
				wasOpen.current = true;
			}
			translateY.set(withSpring(snapPositions[index], SPRING));
		} else if (wasOpen.current) {
			wasOpen.current = false;
			if (KeyboardController.isVisible()) KeyboardController.dismiss();
			translateY.set(
				withSpring(closedPosition, SPRING, (finished) => {
					if (finished) scheduleOnRN(onClosed);
				}),
			);
		}
		// `positionsKey` stands for `snapPositions`, which is a new array on every render.
	}, [
		open,
		mounted,
		ready,
		index,
		positionsKey,
		closedPosition,
		dismissible,
		restore,
		keyboardBehavior,
		insets.bottom,
		maxHeight,
		sheetHeight,
	]);

	useEffect(() => {
		coveredScale.set(withSpring(stackScale ** depth, SPRING));
	}, [depth, stackScale]);

	// `extend`: go to the highest snap point when the keyboard opens.
	const highestIndex = snapPositions.indexOf(Math.min(...snapPositions));
	useAnimatedReaction(
		() => keyboard.progress.get() > 0.5,
		(visible, previous) => {
			if (
				keyboardBehavior === "extend" &&
				visible &&
				previous === false &&
				positions.get().length > 0
			) {
				scheduleOnRN(requestIndex, highestIndex);
			}
		},
		[keyboardBehavior, highestIndex, requestIndex],
	);

	/** How far the sheet rises above its snap position. It stops when the top of the sheet reaches the top limit. */
	const keyboardLift = useDerivedValue(() => {
		if (!followsKeyboard.get()) return 0;
		const lift = Math.max(
			0,
			Math.abs(keyboard.height.get()) - safeBottom.get(),
		);
		return Math.min(lift, Math.max(0, topLimit.get() + translateY.get()));
	});

	useOverlayBackHandler(open && isTop, dismissible ? requestClose : undefined);

	const nativeGesture = useMemo(() => Gesture.Native(), []);

	const panGesture = useMemo(
		() =>
			Gesture.Pan()
				.enabled(isTop)
				.activeOffsetY([-8, 8])
				.simultaneousWithExternalGesture(nativeGesture)
				.onStart(() => {
					start.set(translateY.get());
				})
				.onUpdate((event) => {
					const top = Math.min(...positions.get());
					const bottom = canDismiss.get()
						? closed.get()
						: Math.max(...positions.get());

					// The list is scrolled: it owns the gesture. Keep the start in sync so the sheet doesn't jump later.
					if (hasScroll.get() && scrollOffset.get() > 0) {
						start.set(translateY.get() - event.translationY);
						return;
					}

					let next = start.get() + event.translationY;
					if (next < top) {
						if (hasScroll.get()) {
							// Fully open and dragging up: the list scrolls instead.
							translateY.set(top);
							start.set(top - event.translationY);
							return;
						}
						next = top;
					}

					translateY.set(Math.min(next, bottom));
					if (hasScroll.get()) scrollTo(scrollRef, 0, 0, false);
				})
				.onEnd((event) => {
					const top = Math.min(...positions.get());
					if (
						hasScroll.get() &&
						scrollOffset.get() > 0 &&
						translateY.get() <= top
					)
						return;

					const projected =
						translateY.get() + event.velocityY * VELOCITY_PROJECTION;
					let target = 0;
					positions.get().forEach((position, i) => {
						if (
							Math.abs(position - projected) <
							Math.abs(positions.get()[target] - projected)
						)
							target = i;
					});

					const config = { ...SPRING, velocity: event.velocityY };
					if (
						canDismiss.get() &&
						Math.abs(closed.get() - projected) <
							Math.abs(positions.get()[target] - projected)
					) {
						translateY.set(
							withSpring(closed.get(), config, (finished) => {
								if (finished) scheduleOnRN(onClosed);
							}),
						);
						scheduleOnRN(requestClose);
						return;
					}

					translateY.set(withSpring(positions.get()[target], config));
					scheduleOnRN(settleFromDrag, target);
				}),
		[
			isTop,
			nativeGesture,
			start,
			translateY,
			positions,
			closed,
			canDismiss,
			hasScroll,
			scrollOffset,
			scrollRef,
			onClosed,
			requestClose,
			settleFromDrag,
		],
	);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollOffset.set(event.contentOffset.y);
		},
	});

	const registerScroll = useCallback(() => {
		hasScroll.set(true);
		return () => {
			hasScroll.set(false);
			scrollOffset.set(0);
		};
	}, [hasScroll, scrollOffset]);

	/** 0 when closed, 1 at the first snap point. Drives the Overlay. */
	const progress = useDerivedValue(() => {
		// Until 'content' is measured, the positions are placeholders: closed and first can be equal, which read as fully open.
		if (!isReady.get()) return 0;
		const first = positions.get()[0] ?? 0;
		if (closed.get() === first) return 1;
		return interpolate(
			translateY.get(),
			[closed.get(), first],
			[0, 1],
			Extrapolation.CLAMP,
		);
	});

	const sheetStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateY: translateY.get() - keyboardLift.get() },
			{ scale: coveredScale.get() },
		],
	}));

	// Keeps the footer at the bottom of the screen at every snap point, and lets it leave with the sheet.
	const footerStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateY: -Math.min(
					translateY.get(),
					Math.max(...positions.get()),
				),
			},
		],
	}));

	const onContentLayout = (event: LayoutChangeEvent) => {
		if (!fitsContent) return;
		const { height } = event.nativeEvent.layout;
		setContentHeight((previous) => (previous === height ? previous : height));
	};

	const onFooterLayout = (event: LayoutChangeEvent) => {
		const { height } = event.nativeEvent.layout;
		setFooterHeight((previous) => (previous === height ? previous : height));
	};

	return {
		mounted,
		open,
		isTop,
		dismissible,
		close: requestClose,
		sheetHeight,
		fitsContent,
		footerHeight,
		progress,
		gesture: panGesture,
		sheetStyle,
		footerStyle,
		onContentLayout,
		onFooterLayout,
		context: {
			index,
			snapCount: snapPoints.length,
			requestIndex,
			close: requestClose,
			footerHeight,
			nativeGesture,
			scrollRef,
			scrollHandler,
			registerScroll,
		},
	};
}

/**
 * A function that keeps the same identity across renders and always runs the latest `callback`.
 * For callbacks scheduled from the UI thread: they see the current props without rebuilding the gesture.
 */
function useLatestCallback<Args extends unknown[], Result>(
	callback: (...args: Args) => Result,
) {
	const ref = useRef(callback);
	useLayoutEffect(() => {
		ref.current = callback;
	});
	return useCallback((...args: Args) => ref.current(...args), []);
}

export type BottomSheetContentContextValue = ReturnType<
	typeof useBottomSheetContent
>["context"];

export const BottomSheetContentContext =
	createContext<BottomSheetContentContextValue | null>(null);

export function useBottomSheetContentContext() {
	const context = use(BottomSheetContentContext);
	if (!context) {
		throw new Error("This part must be rendered inside BottomSheet.Content.");
	}
	return context;
}
