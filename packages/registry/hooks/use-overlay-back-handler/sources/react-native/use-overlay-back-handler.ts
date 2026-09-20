import { useEffect, useRef } from "react";
import { BackHandler } from "react-native";

/**
 * Closes an open overlay (sheet, dialog, menu) on the Android back button instead of leaving the screen.
 * The press is consumed while the overlay is open, even when it can't be dismissed.
 *
 * Version for projects without a navigation library. The Expo Router and React Navigation versions also
 * close the overlay on the back gesture and the header back button.
 */
export function useOverlayBackHandler(
	open: boolean,
	onClose: (() => void) | undefined,
) {
	const latest = useRef(onClose);
	useEffect(() => {
		latest.current = onClose;
	});

	useEffect(() => {
		if (!open) return;
		const subscription = BackHandler.addEventListener(
			"hardwareBackPress",
			() => {
				latest.current?.();
				return true;
			},
		);
		return () => subscription.remove();
	}, [open]);
}
