import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useDerivedValue,
	useReducedMotion,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

/** See the five statuses a pull goes through in the Pull-to-refresh behavior. */
export type RefreshStatus =
	"idle" | "pulling" | "armed" | "refreshing" | "settling";

export type UseRefreshControlOptions = {
	/** Called on release past the threshold, or by `refresh()`. Handle its errors here. */
	onRefresh: () => Promise<unknown> | void;
	/** Distance in pt that arms the refresh. Also the height held while refreshing. */
	threshold?: number;
	/** Limit of the rubber band. */
	maxDistance?: number;
	/** Minimum time in ms spent in `refreshing`, so a fast request doesn't flash the indicator. */
	minDuration?: number;
	/** Turns the pull off, for example while the first page loads. */
	enabled?: boolean;
	/** Called once per pull when the status becomes `armed`. A good place for a light haptic. */
	onArmed?: () => void;
};

const isIOS = Platform.OS === "ios";
// Long enough to read as a return, short enough not to delay the next pull.
const SETTLE_DURATION = 220;
// Below this the list is at the top and the pull owns the gesture (Android).
const TOP_EPSILON = 1;

/** The further the finger goes, the harder it gets, and it never goes past `max`. */
function resist(drag: number, max: number) {
	"worklet";
	if (drag <= 0) return 0;
	return (drag * max) / (drag + max);
}

function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Pull-to-refresh for any list or ScrollView, on iOS and Android.
 *
 * iOS reads the native bounce, Android a Pan gesture running alongside the list's own scroll.
 * Both feed the same `distance`, so an indicator written once works on both.
 */
export function useRefreshControl({
	onRefresh,
	threshold = 64,
	maxDistance = 160,
	minDuration = 500,
	enabled = true,
	onArmed,
}: UseRefreshControlOptions) {
	const [status, setStatus] = useState<RefreshStatus>("idle");
	const reduceMotion = useReducedMotion();

	const distance = useSharedValue(0);
	// Mirrors `status` on the UI thread, where the gesture and the scroll handler decide.
	const phase = useSharedValue<RefreshStatus>("idle");
	const armAt = useSharedValue(threshold);
	const limit = useSharedValue(maxDistance);
	const isEnabled = useSharedValue(enabled);
	// Android: the list takes the gesture back as soon as it isn't at the top.
	const atTop = useSharedValue(true);
	// `onArmed` fires once per pull, not on every crossing of the threshold.
	const armedFired = useSharedValue(false);

	const progress = useDerivedValue(() =>
		Math.min(distance.value / armAt.value, 1),
	);

	// Callbacks run from the UI thread read the latest render through this ref.
	const latest = useRef({ onRefresh, onArmed });
	useEffect(() => {
		latest.current = { onRefresh, onArmed };
	});

	const running = useRef(false);

	useEffect(() => {
		armAt.value = threshold;
		limit.value = maxDistance;
		isEnabled.value = enabled;
		// Turned off mid-pull: drop the pull, but let a running refresh finish.
		if (!enabled && (phase.value === "pulling" || phase.value === "armed")) {
			distance.value = 0;
			phase.value = "idle";
			setStatus("idle");
		}
	}, [threshold, maxDistance, enabled]);

	const notifyArmed = useCallback(() => latest.current.onArmed?.(), []);

	const toIdle = useCallback(() => {
		phase.value = "idle";
		setStatus("idle");
	}, [phase]);

	/** Animates the list back to its place. iOS cancels through the native bounce instead. */
	const settle = useCallback(() => {
		phase.value = "settling";
		setStatus("settling");
		if (reduceMotion) {
			distance.value = 0;
			toIdle();
			return;
		}
		distance.value = withTiming(
			0,
			{ duration: SETTLE_DURATION },
			(finished) => {
				"worklet";
				if (finished) scheduleOnRN(toIdle);
			},
		);
	}, [distance, phase, reduceMotion, toIdle]);

	const run = useCallback(async () => {
		if (running.current) return;
		running.current = true;
		armedFired.value = false;
		phase.value = "refreshing";
		setStatus("refreshing");
		// Hold the list open at the threshold while the request runs.
		distance.value = reduceMotion
			? armAt.value
			: withTiming(armAt.value, { duration: SETTLE_DURATION });

		const started = Date.now();
		try {
			await latest.current.onRefresh();
		} finally {
			const elapsed = Date.now() - started;
			if (elapsed < minDuration) await wait(minDuration - elapsed);
			running.current = false;
			settle();
		}
	}, [armAt, armedFired, distance, phase, minDuration, reduceMotion, settle]);

	/**
	 * Starts a refresh without a pull: a retry button, a screen focus, a push notification,
	 * or the refresh button screen reader users need. Does nothing while one is already running.
	 */
	const refresh = useCallback(() => run(), [run]);

	// The pull path can't rethrow anywhere useful, and `onRefresh` owns its errors by contract.
	// `refresh()` still rejects, so a caller that awaits it sees the failure.
	const refreshFromGesture = useCallback(() => {
		void run().catch(() => {});
	}, [run]);

	/** Turns a raw drag into `distance` and moves the status along. Runs on the UI thread. */
	const track = useCallback(
		(drag: number) => {
			"worklet";
			if (!isEnabled.value) return;
			if (phase.value === "refreshing" || phase.value === "settling") return;

			distance.value = resist(drag, limit.value);
			const next: RefreshStatus =
				drag <= 0
					? "idle"
					: distance.value >= armAt.value
						? "armed"
						: "pulling";
			if (next === phase.value) return;

			phase.value = next;
			scheduleOnRN(setStatus, next);
			if (next === "idle") armedFired.value = false;
			if (next === "armed" && !armedFired.value) {
				armedFired.value = true;
				scheduleOnRN(notifyArmed);
			}
		},
		[armAt, armedFired, distance, isEnabled, limit, notifyArmed, phase],
	);

	/** The finger leaves the screen: refresh if armed, otherwise go back. Runs on the UI thread. */
	const release = useCallback(() => {
		"worklet";
		if (phase.value !== "pulling" && phase.value !== "armed") return;

		if (phase.value === "armed") {
			// Claimed here rather than in `run`, so the scroll events of the bounce-back don't reopen a pull.
			phase.value = "refreshing";
			scheduleOnRN(setStatus, "refreshing");
			scheduleOnRN(refreshFromGesture);
			return;
		}

		armedFired.value = false;
		// iOS lets the native bounce carry the list back, and `onScroll` takes `distance` and the status with it.
		if (!isIOS) scheduleOnRN(settle);
	}, [armedFired, phase, refreshFromGesture, settle]);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			const offset = event.contentOffset.y;
			atTop.value = offset <= TOP_EPSILON;
			// iOS: the list bounces, so the overscroll is the drag. Android never reports a negative offset.
			if (isIOS) track(-offset);
		},
		onEndDrag: () => {
			if (isIOS) release();
		},
	});

	/**
	 * Attach to the list with a single `GestureDetector`. On Android the Pan runs alongside the
	 * list's own scroll; on iOS only the native gesture is needed, the bounce does the rest.
	 */
	const gesture = useMemo(() => {
		const native = Gesture.Native();
		if (isIOS) return native;

		const pan = Gesture.Pan()
			.activeOffsetY([-8, 8])
			.simultaneousWithExternalGesture(native)
			.onUpdate((event) => {
				if (!atTop.value) return;
				track(event.translationY);
			})
			.onEnd(() => release());

		return Gesture.Simultaneous(pan, native);
	}, [atTop, release, track]);

	// Android has no bounce: the list itself moves to open the gap the indicator sits in.
	const listStyle = useAnimatedStyle(() =>
		isIOS ? {} : { transform: [{ translateY: distance.value }] },
	);

	const holdingOpen = status === "refreshing";

	/**
	 * Spread on an `Animated.ScrollView`, `Animated.FlatList`, `Animated.SectionList` or `AnimatedFlashList`.
	 * Put it before your own `style`, or merge the two in an array.
	 */
	const scrollProps = {
		onScroll: scrollHandler,
		scrollEventThrottle: 16,
		style: listStyle,
		// iOS: an inset equal to the threshold keeps the bounce open while the request runs.
		...(isIOS
			? { bounces: true, contentInset: { top: holdingOpen ? threshold : 0 } }
			: null),
	};

	return {
		status,
		refreshing: status === "refreshing",
		distance,
		progress,
		refresh,
		gesture,
		scrollProps,
	};
}

export type RefreshControl = ReturnType<typeof useRefreshControl>;
