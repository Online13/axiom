import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { AccessibilityInfo } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import type { IconName } from "@/components/ui/icons";

export type ToastType = "default" | "success" | "error" | "info" | "loading";

export type ToastOptions = {
	title: string;
	description?: string;
	type?: ToastType;
	/** Replaces the type icon. */
	icon?: IconName;
	/** Time on screen in ms. `Infinity` keeps it until dismissed. Loading toasts never time out. */
	duration?: number;
	/** Passing an existing id updates that toast in place. */
	id?: string;
	onPress?: () => void;
	/** Called when the toast leaves, by timeout, swipe or `toast.dismiss`. */
	onDismiss?: () => void;
};

export type ToastData = Omit<ToastOptions, "id"> & {
	id: string;
	type: ToastType;
	open: boolean;
};

// A module-level store, so `toast.show` works from anywhere, outside React too.
let toasts: ToastData[] = [];
const listeners = new Set<() => void>();
let counter = 0;

function emit(next: ToastData[]) {
	toasts = next;
	listeners.forEach((listener) => listener());
}

function show(options: ToastOptions): string {
	const id = options.id ?? `toast-${++counter}`;
	const existing = toasts.find((item) => item.id === id);
	const data: ToastData = {
		...existing,
		...options,
		id,
		type: options.type ?? "default",
		open: true,
	};

	if (existing) {
		emit(toasts.map((item) => (item.id === id ? data : item)));
	} else {
		emit([data, ...toasts]);
	}
	AccessibilityInfo.announceForAccessibility(
		options.description
			? `${options.title}. ${options.description}`
			: options.title,
	);
	return id;
}

type Shortcut = (
	title: string,
	options?: Omit<ToastOptions, "title" | "type">,
) => string;
const withType =
	(type: ToastType): Shortcut =>
	(title, options) =>
		show({ ...options, title, type });

type PromiseMessages<T> = {
	loading: string;
	success: string | ((value: T) => string);
	error: string | ((error: unknown) => string);
};

export const toast = {
	show,
	success: withType("success"),
	error: withType("error"),
	info: withType("info"),
	loading: withType("loading"),
	promise<T>(promise: Promise<T>, messages: PromiseMessages<T>): Promise<T> {
		const id = show({ title: messages.loading, type: "loading" });
		promise.then(
			(value) =>
				show({
					id,
					type: "success",
					title:
						typeof messages.success === "function"
							? messages.success(value)
							: messages.success,
				}),
			(error: unknown) =>
				show({
					id,
					type: "error",
					title:
						typeof messages.error === "function"
							? messages.error(error)
							: messages.error,
				}),
		);
		return promise;
	},
	/** Hides one toast, or all of them. */
	dismiss(id?: string) {
		emit(
			toasts.map((item) =>
				id === undefined || item.id === id
					? { ...item, open: false }
					: item,
			),
		);
	},
};

/** Called by the toast once its exit animation ends. */
function remove(id: string) {
	const item = toasts.find((entry) => entry.id === id);
	emit(toasts.filter((entry) => entry.id !== id));
	item?.onDismiss?.();
}

export function useToasts() {
	return useSyncExternalStore(
		(listener) => {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		() => toasts,
	);
}

const DEFAULT_DURATION = 4000;
const SPRING = { stiffness: 380, damping: 34, mass: 1 };

export type UseToastItemOptions = {
	toast: ToastData;
	/** Position in the stack, 0 for the newest. */
	index: number;
	/** Vertical offset of the toast in the stack. */
	offset: number;
	scale: number;
	hidden: boolean;
	/** The timer stops while the stack is expanded. */
	paused: boolean;
	swipeToDismiss: boolean;
};

/** Timer, swipe up to dismiss, stack position and enter and exit animation of one toast. */
export function useToastItem({
	toast: data,
	offset,
	scale,
	hidden,
	paused,
	swipeToDismiss,
}: UseToastItemOptions) {
	const progress = useSharedValue(0);
	const translateY = useSharedValue(offset);
	const scaleValue = useSharedValue(scale);
	const drag = useSharedValue(0);
	// The timer pauses while a finger is on the toast.
	const [touching, setTouching] = useState(false);

	useEffect(() => {
		translateY.value = withSpring(offset, SPRING);
		scaleValue.value = withSpring(scale, SPRING);
	}, [offset, scale, translateY, scaleValue]);

	useEffect(() => {
		if (data.open) {
			progress.value = withSpring(hidden ? 0 : 1, SPRING);
			return;
		}
		const finish = () => remove(data.id);
		progress.value = withTiming(0, { duration: 180 }, (finished) => {
			if (finished) scheduleOnRN(finish);
		});
	}, [data.open, data.id, hidden, progress]);

	const duration =
		data.type === "loading" ? Infinity : (data.duration ?? DEFAULT_DURATION);

	useEffect(() => {
		if (
			!data.open ||
			paused ||
			hidden ||
			touching ||
			!Number.isFinite(duration)
		)
			return;
		const timeout = setTimeout(() => toast.dismiss(data.id), duration);
		return () => clearTimeout(timeout);
		// A new title or type (an updated toast) restarts the timer.
	}, [
		data.open,
		data.id,
		data.title,
		data.type,
		paused,
		hidden,
		touching,
		duration,
	]);

	const id = data.id;
	const gesture = useMemo(() => {
		const dismiss = () => toast.dismiss(id);
		return Gesture.Pan()
			.enabled(swipeToDismiss)
			.activeOffsetY([-10, 10])
			.onBegin(() => {
				scheduleOnRN(setTouching, true);
			})
			.onUpdate((event) => {
				// Up follows the finger, down resists.
				drag.value =
					event.translationY < 0
						? event.translationY
						: event.translationY * 0.2;
			})
			.onEnd((event) => {
				if (event.translationY < -24 || event.velocityY < -500) {
					scheduleOnRN(dismiss);
				} else {
					drag.value = withSpring(0, SPRING);
				}
			})
			.onFinalize(() => {
				scheduleOnRN(setTouching, false);
			});
		// `drag` is a shared value: a stable reference.
	}, [id, swipeToDismiss]);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: progress.value,
		transform: [
			{
				translateY:
					translateY.value + drag.value + (1 - progress.value) * -24,
			},
			{ scale: scaleValue.value },
		],
	}));

	return { gesture, animatedStyle, setTouching };
}
