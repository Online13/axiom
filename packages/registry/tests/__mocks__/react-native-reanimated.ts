import { useState } from "react";

// The mock Reanimated ships for Jest, with the gaps that would make component tests lie:
// - its `useSharedValue` returns a new value on every render, so a value set by a gesture or an
//   effect is gone on the next render. Here it lives as long as the component, as on a device;
// - its `makeMutable` returns a value without `get` and `set`. Here it is the same as a shared value;
// - it has no `useReducedMotion`. Here Reduce Motion is off, unless a test mocks it on;
// - its `useAnimatedScrollHandler` drops every event. Here the handler it returns, set as `onScroll`,
//   calls the handler matching the event's `eventName` (`onScroll` when there is none), as Reanimated
//   routes the scroll events of an animated list.
const mock = jest.requireActual("react-native-reanimated/mock");

function useSharedValue<T>(initial: T) {
	const [value] = useState(() => mock.useSharedValue(initial));
	return value;
}

const makeMutable = <T>(initial: T) => mock.useSharedValue(initial);

const useReducedMotion = jest.fn(() => false);

type ScrollEvent = { eventName?: string; contentOffset?: { x: number; y: number } };
type ScrollHandlers = Partial<
	Record<"onScroll" | "onBeginDrag" | "onEndDrag" | "onMomentumBegin" | "onMomentumEnd", (event: ScrollEvent) => void>
>;

const scrollEvents: Record<string, keyof ScrollHandlers> = {
	onScrollBeginDrag: "onBeginDrag",
	onScrollEndDrag: "onEndDrag",
	onMomentumScrollBegin: "onMomentumBegin",
	onMomentumScrollEnd: "onMomentumEnd",
};

function useAnimatedScrollHandler(handlers: ScrollHandlers | ScrollHandlers["onScroll"]) {
	const routed: ScrollHandlers = typeof handlers === "function" ? { onScroll: handlers } : (handlers ?? {});
	return (event: { nativeEvent?: ScrollEvent } & ScrollEvent) => {
		const payload = event.nativeEvent ?? event;
		const name = payload.eventName ? scrollEvents[payload.eventName] : "onScroll";
		if (name) routed[name]?.(payload);
	};
}

// @ts-ignore: CommonJS replaces the whole module, which Jest needs; not every demo loads Node's types.
module.exports = {
	...mock,
	useSharedValue,
	makeMutable,
	useReducedMotion,
	useAnimatedScrollHandler,
	default: { ...mock.default, useSharedValue, useReducedMotion, useAnimatedScrollHandler },
};
