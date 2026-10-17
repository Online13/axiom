import { BackHandler } from "react-native";

/**
 * Captures the Android back button listeners. `press()` calls them as the system does, the newest
 * first, and returns whether one consumed the press. Call `restoreBackButton()` after each test.
 */
export function spyOnBackButton() {
	type Listener = Parameters<typeof BackHandler.addEventListener>[1];
	const listeners: Listener[] = [];
	jest.spyOn(BackHandler, "addEventListener").mockImplementation((_, listener) => {
		listeners.push(listener);
		return { remove: () => listeners.splice(listeners.indexOf(listener), 1) };
	});
	return {
		press: () => [...listeners].reverse().some((listener) => listener({} as never) === true),
	};
}

/**
 * Puts the real BackHandler back. Only this spy: `jest.restoreAllMocks()` would also strip the
 * implementations of the module mocks in __mocks__.
 */
export function restoreBackButton() {
	(BackHandler.addEventListener as Partial<jest.Mock>).mockRestore?.();
}
