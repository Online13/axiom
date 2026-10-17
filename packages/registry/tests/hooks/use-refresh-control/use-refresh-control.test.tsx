import { act, renderHook } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { useReducedMotion } from "react-native-reanimated";

import { useRefreshControl, type UseRefreshControlOptions } from "@/hooks/use-refresh-control";

import { advance } from "../../utils/time";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

/** A request that resolves or fails when the test says so. */
function deferred() {
	let resolve!: () => void;
	let reject!: (error: Error) => void;
	const promise = new Promise<void>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return { promise, resolve, reject };
}

async function setup(options: Partial<UseRefreshControlOptions> = {}) {
	const onRefresh = options.onRefresh ?? jest.fn();
	const hook = await renderHook((props: Partial<UseRefreshControlOptions>) =>
		useRefreshControl({ onRefresh, ...props }),
		{ initialProps: options },
	);

	// iOS: the list bounces past the top, and the overscroll is the drag. Sent as Reanimated sends it.
	const scroll = async (overscroll: number, eventName?: string) => {
		await act(() =>
			hook.result.current.scrollProps.onScroll({
				nativeEvent: { eventName, contentOffset: { x: 0, y: -overscroll } },
			} as never),
		);
		// The status reaches React through `scheduleOnRN`, a microtask.
		await advance(0);
	};

	return {
		...hook,
		onRefresh,
		status: () => hook.result.current.status,
		pull: (distance: number) => scroll(distance),
		release: (distance: number) => scroll(distance, "onScrollEndDrag"),
	};
}

describe("useRefreshControl", () => {
	test("starts idle", async () => {
		const { result } = await setup();

		expect(result.current.status).toBe("idle");
		expect(result.current.refreshing).toBe(false);
		expect(result.current.distance.get()).toBe(0);
	});

	describe("refresh()", () => {
		test("runs onRefresh, holds the indicator at least minDuration, then settles back to idle", async () => {
			const { result, onRefresh, status } = await setup({ minDuration: 500 });

			await act(() => {
				void result.current.refresh();
			});
			expect(onRefresh).toHaveBeenCalledTimes(1);
			expect(status()).toBe("refreshing");
			expect(result.current.refreshing).toBe(true);

			await advance(400);
			expect(status()).toBe("refreshing");

			await advance(100);
			expect(status()).toBe("idle");
			expect(result.current.distance.get()).toBe(0);
		});

		test("a slow request keeps refreshing until it settles, with no extra wait", async () => {
			const request = deferred();
			const { result, status } = await setup({ onRefresh: () => request.promise, minDuration: 500 });

			await act(() => {
				void result.current.refresh();
			});
			await advance(2_000);
			expect(status()).toBe("refreshing");

			await act(async () => request.resolve());
			await advance(0);
			expect(status()).toBe("idle");
		});

		test("does nothing while a refresh is already running", async () => {
			const request = deferred();
			const onRefresh = jest.fn(() => request.promise);
			const { result } = await setup({ onRefresh });

			await act(() => {
				void result.current.refresh();
				void result.current.refresh();
			});

			expect(onRefresh).toHaveBeenCalledTimes(1);
		});

		test("rejects when onRefresh fails, and still goes back to idle", async () => {
			const { result, status } = await setup({
				onRefresh: () => Promise.reject(new Error("offline")),
				minDuration: 0,
			});

			let error: unknown;
			await act(async () => {
				await result.current.refresh().catch((e: unknown) => (error = e));
			});
			await advance(0);

			expect(error).toEqual(new Error("offline"));
			expect(status()).toBe("idle");
		});

		test("calls the latest onRefresh", async () => {
			const first = jest.fn();
			const second = jest.fn();
			const { result, rerender } = await setup({ onRefresh: first });

			await rerender({ onRefresh: second });
			await act(() => {
				void result.current.refresh();
			});

			expect(first).not.toHaveBeenCalled();
			expect(second).toHaveBeenCalledTimes(1);
		});
	});

	describe("pull (iOS)", () => {
		test("a short pull is 'pulling', and resists more the further it goes", async () => {
			const { pull, status, result } = await setup({ threshold: 64, maxDistance: 160 });

			await pull(40);

			expect(status()).toBe("pulling");
			// 40 * 160 / (40 + 160): the rubber band.
			expect(result.current.distance.get()).toBe(32);
			expect(result.current.progress.get()).toBe(0.5);
		});

		test("past the threshold it arms, once per pull, with a haptic and onArmed", async () => {
			const onArmed = jest.fn();
			const { pull, status } = await setup({ onArmed });

			await pull(200);
			await pull(150);
			await pull(220);

			expect(status()).toBe("armed");
			expect(onArmed).toHaveBeenCalledTimes(1);
			expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
			expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
		});

		test("haptic={false} arms silently", async () => {
			const { pull } = await setup({ haptic: false });

			await pull(200);

			expect(Haptics.impactAsync).not.toHaveBeenCalled();
		});

		test("releasing while armed refreshes", async () => {
			const { pull, release, status, onRefresh, result } = await setup({ threshold: 64 });

			await pull(200);
			await release(200);

			expect(status()).toBe("refreshing");
			expect(onRefresh).toHaveBeenCalledTimes(1);
			// iOS holds the list open with an inset as tall as the threshold.
			expect(result.current.scrollProps).toMatchObject({ bounces: true, contentInset: { top: 64 } });
		});

		test("releasing before the threshold doesn't refresh, and the bounce brings it back to idle", async () => {
			const { pull, release, status, onRefresh } = await setup();

			await pull(30);
			await release(30);
			expect(onRefresh).not.toHaveBeenCalled();

			await pull(0);
			expect(status()).toBe("idle");
		});

		test("a new pull can arm again after going back to the top", async () => {
			const onArmed = jest.fn();
			const { pull } = await setup({ onArmed });

			await pull(200);
			await pull(0);
			await pull(200);

			expect(onArmed).toHaveBeenCalledTimes(2);
		});

		test("scrolling the list down is not a pull", async () => {
			const { pull, status } = await setup();

			await pull(-300);

			expect(status()).toBe("idle");
		});

		test("the bounce-back of a release doesn't start a new pull while refreshing", async () => {
			const request = deferred();
			const onArmed = jest.fn();
			const { pull, release, status } = await setup({ onRefresh: () => request.promise, onArmed });

			await pull(200);
			await release(200);
			await pull(120);
			await pull(60);

			expect(status()).toBe("refreshing");
			expect(onArmed).toHaveBeenCalledTimes(1);
		});
	});

	describe("enabled", () => {
		test("a disabled control ignores pulls: the list doesn't move and nothing arms", async () => {
			const onArmed = jest.fn();
			const { pull, status, result } = await setup({ enabled: false, onArmed });

			await pull(200);

			expect(status()).toBe("idle");
			expect(result.current.distance.get()).toBe(0);
			expect(onArmed).not.toHaveBeenCalled();
		});

		test("turned off mid-pull drops the pull", async () => {
			const { pull, status, rerender } = await setup();

			await pull(200);
			await rerender({ enabled: false });

			expect(status()).toBe("idle");
		});

		test("turned off during a refresh lets it finish", async () => {
			const request = deferred();
			const { result, rerender, status } = await setup({ onRefresh: () => request.promise });

			await act(() => {
				void result.current.refresh();
			});
			await rerender({ enabled: false });

			expect(status()).toBe("refreshing");
		});
	});

	test("with Reduce Motion, it jumps back to idle without animating", async () => {
		jest.mocked(useReducedMotion).mockReturnValue(true);
		const { result, status } = await setup({ minDuration: 0 });

		await act(async () => {
			await result.current.refresh();
		});

		expect(status()).toBe("idle");
		expect(result.current.distance.get()).toBe(0);
		jest.mocked(useReducedMotion).mockReturnValue(false);
	});
});
