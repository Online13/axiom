import { useContext, useEffect, useId, useLayoutEffect, useRef } from "react";
import { BackHandler } from "react-native";
import {
	NavigationContext,
	NavigationRouteContext,
	PreventRemoveContext,
} from "expo-router/react-navigation";

/**
 * Closes an open overlay (sheet, dialog, menu) on a back action instead of leaving the screen:
 * - the Android back button, even on the first screen of the stack;
 * - the back gesture and the header back button, which Expo Router would otherwise use to remove the screen.
 *
 * The action is consumed while the overlay is open, even when it can't be dismissed. A navigation your code
 * starts in the same press that closes the overlay still goes through: a dialog action that calls
 * `router.back()` closes the dialog and leaves the screen.
 *
 * Outside a screen (a root layout, for instance), only the Android back button is handled.
 */
export function useOverlayBackHandler(
	open: boolean,
	onClose: (() => void) | undefined,
) {
	const latest = useRef(onClose);
	const isOpen = useRef(open);
	useLayoutEffect(() => {
		latest.current = onClose;
		isOpen.current = open;
	});
	// Unmounted with the overlay (`{open && <Dialog …>}`): counts as closed.
	useLayoutEffect(
		() => () => {
			isOpen.current = false;
		},
		[],
	);

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

	// Same as `usePreventRemove`, which throws outside a screen. Read through contexts, the hook works anywhere.
	const navigation = useContext(NavigationContext);
	const route = useContext(NavigationRouteContext);
	const preventRemove = useContext(PreventRemoveContext);
	const id = useId();
	const routeKey = route?.key;
	const setPreventRemove = preventRemove?.setPreventRemove;

	// Tells a native stack to block its native dismissal (iOS swipe back) while the overlay is open.
	useEffect(() => {
		if (!routeKey || !setPreventRemove) return;
		setPreventRemove(id, routeKey, open);
		return () => setPreventRemove(id, routeKey, false);
	}, [id, routeKey, setPreventRemove, open]);

	useEffect(() => {
		if (!open || !navigation || !routeKey) return;
		return navigation.addListener("beforeRemove", (event) => {
			event.preventDefault();
			const { action } = event.data;
			// A back gesture leaves the overlay open. A press that also closes it (`setOpen(false)` then
			// `router.back()`, in any order) has committed by the next frame: the navigation is replayed.
			requestAnimationFrame(() => {
				if (isOpen.current) latest.current?.();
				else navigation.dispatch(action);
			});
		});
	}, [navigation, routeKey, open]);
}
