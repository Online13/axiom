import { View } from "react-native";
import { act, fireEvent } from "@testing-library/react-native";
import type { TestInstance } from "test-renderer";

// What `userEvent` can't do: stop halfway through a gesture, or report a size or a scroll.
// Each helper fires the event a real device sends, with only the fields the components read.

function touch() {
	return {
		persist() {},
		nativeEvent: {
			changedTouches: [],
			touches: [],
			identifier: 0,
			locationX: 0,
			locationY: 0,
			pageX: 0,
			pageY: 0,
			target: 0,
			timestamp: Date.now(),
		},
		currentTarget: { measure() {} },
	};
}

/** The finger touches a `Pressable` and stays down: its pressed state can be checked. */
export async function pressIn(element: TestInstance) {
	await fireEvent(element, "responderGrant", touch());
}

// Pressability holds the pressed state at least this long, even for a quick tap.
const MIN_PRESS_DURATION = 130;

/** The finger lifts, ending a `pressIn`. Needs fake timers: it waits out the minimum press. */
export async function pressOut(element: TestInstance) {
	await fireEvent(element, "responderRelease", touch());
	await act(() => jest.advanceTimersByTime(MIN_PRESS_DURATION));
}

/** Reports the size an element was laid out at, as `onLayout` receives it. */
export async function layout(
	element: TestInstance,
	{ width, height, x = 0, y = 0 }: { width: number; height: number; x?: number; y?: number },
) {
	await fireEvent(element, "layout", {
		nativeEvent: { layout: { x, y, width, height } },
	});
}

type Rect = { x: number; y: number; width: number; height: number };

/**
 * Makes views report this rect from `measureInWindow`, where a menu reads its trigger's position.
 * React Native's Jest mock never calls back on its own.
 */
export function placeInWindow({ x, y, width, height }: Rect) {
	return jest
		.spyOn(View.prototype as unknown as { measureInWindow: (cb: (...n: number[]) => void) => void }, "measureInWindow")
		.mockImplementation((callback) => callback(x, y, width, height));
}
