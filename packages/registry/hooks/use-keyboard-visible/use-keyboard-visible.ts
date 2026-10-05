import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

/**
 * Whether the software keyboard is up. Call it in the screen that reacts to it, for example to
 * hide a bottom tab bar and leave the field room: `{keyboardVisible ? null : <BottomTabBar … />}`.
 */
export function useKeyboardVisible(): boolean {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		// `Will` fires with the animation on iOS; Android only ever sends `Did`.
		const subscriptions = [
			Keyboard.addListener("keyboardWillShow", () => setVisible(true)),
			Keyboard.addListener("keyboardWillHide", () => setVisible(false)),
			Keyboard.addListener("keyboardDidShow", () => setVisible(true)),
			Keyboard.addListener("keyboardDidHide", () => setVisible(false)),
		];
		return () => subscriptions.forEach((subscription) => subscription.remove());
	}, []);

	return visible;
}
