import { act } from "@testing-library/react-native";

/**
 * Moves fake time forward and flushes what it triggers: timers, animation callbacks, and the
 * microtasks `scheduleOnRN` queues when an animation ends (Jest fakes `queueMicrotask` too).
 */
export async function advance(ms: number) {
	await act(() => jest.advanceTimersByTimeAsync(ms));
}
