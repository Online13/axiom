import { createContext, use, useEffect, useState } from "react";
import {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { useOverlayStack } from "@/components/core/overlay-stack";
import { useControllableState } from "@/hooks/use-controllable-state";
import { useOverlayBackHandler } from "@/hooks/use-overlay-back-handler";

export type UseDialogOptions = {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
};

export function useDialog({
	open,
	defaultOpen = false,
	onOpenChange,
}: UseDialogOptions) {
	const [current, setOpen] = useControllableState({
		value: open,
		defaultValue: defaultOpen,
		onChange: onOpenChange,
	});
	return { open: current, setOpen };
}

export type DialogContextValue = ReturnType<typeof useDialog>;

export const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialogContext() {
	const context = use(DialogContext);
	if (!context)
		throw new Error("Dialog parts must be rendered inside Dialog.Root.");
	return context;
}

const DURATION = 200;

export type UseDialogContentOptions = {
	/** Closes on backdrop press and the Android back button. */
	dismissible?: boolean;
	/** Called after the close animation. */
	onDismiss?: () => void;
};

/** Mounting, enter and exit animation and back button of the dialog surface, shared by every styling variant. */
export function useDialogContent({
	dismissible = true,
	onDismiss,
}: UseDialogContentOptions) {
	const { open, setOpen } = useDialogContext();
	// Pushes a sheet it opens over back, like a second sheet would.
	const { isTop } = useOverlayStack(open);
	const [mounted, setMounted] = useState(open);
	if (open && !mounted) setMounted(true);

	const progress = useSharedValue(0);
	const close = () => setOpen(false);

	useOverlayBackHandler(open && isTop, dismissible ? close : undefined);

	useEffect(() => {
		if (!mounted) return;
		if (open) {
			progress.value = withTiming(1, { duration: DURATION });
			return;
		}
		const finish = () => {
			setMounted(false);
			onDismiss?.();
		};
		// Reanimated jumps to the end when Reduce Motion is on.
		progress.value = withTiming(0, { duration: DURATION }, (finished) => {
			if (finished) scheduleOnRN(finish);
		});
		// Only `open` starts an animation; `onDismiss` is read when it ends.
	}, [open, mounted]);

	const surfaceStyle = useAnimatedStyle(() => ({
		opacity: progress.value,
		transform: [{ scale: 0.94 + progress.value * 0.06 }],
	}));

	return { mounted, open, isTop, close, dismissible, surfaceStyle };
}
