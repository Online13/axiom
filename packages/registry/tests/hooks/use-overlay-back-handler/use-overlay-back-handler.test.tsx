import type { ReactNode } from "react";
import { BackHandler } from "react-native";
import { renderHook } from "@testing-library/react-native";
import {
	NavigationContext,
	NavigationRouteContext,
	PreventRemoveContext,
} from "expo-router/react-navigation";

import { useOverlayBackHandler } from "@/hooks/use-overlay-back-handler";

import { advance } from "../../utils/time";

jest.useFakeTimers();

afterEach(() => jest.restoreAllMocks());

/** Captures the Android back button listeners, as the system calls them. */
function spyOnBackButton() {
	const listeners = new Set<Parameters<typeof BackHandler.addEventListener>[1]>();
	jest.spyOn(BackHandler, "addEventListener").mockImplementation((_, listener) => {
		listeners.add(listener);
		return { remove: () => listeners.delete(listener) };
	});
	return {
		/** Presses back; true when a listener consumed it. */
		press: () => [...listeners].reverse().some((listener) => listener({} as never) === true),
		get count() {
			return listeners.size;
		},
	};
}

/** A screen of a native stack: the navigation, its route, and the prevent-remove registry. */
function screenOf() {
	const beforeRemove = new Set<(event: unknown) => void>();
	const navigation = {
		addListener: jest.fn((_: string, listener: (event: unknown) => void) => {
			beforeRemove.add(listener);
			return () => beforeRemove.delete(listener);
		}),
		dispatch: jest.fn(),
	};
	const setPreventRemove = jest.fn();
	const action = { type: "GO_BACK" };

	function wrapper({ children }: { children: ReactNode }) {
		return (
			<NavigationContext.Provider value={navigation as never}>
				<NavigationRouteContext.Provider value={{ key: "screen-1", name: "screen" } as never}>
					<PreventRemoveContext.Provider value={{ preventedRoutes: {}, setPreventRemove } as never}>
						{children}
					</PreventRemoveContext.Provider>
				</NavigationRouteContext.Provider>
			</NavigationContext.Provider>
		);
	}

	return {
		wrapper,
		navigation,
		setPreventRemove,
		action,
		/** The stack tries to remove the screen (back gesture, header back button). */
		leave() {
			const event = { preventDefault: jest.fn(), data: { action } };
			beforeRemove.forEach((listener) => listener(event));
			return event;
		},
	};
}

type Props = { open: boolean; onClose?: () => void };

describe("useOverlayBackHandler", () => {
	describe("Android back button", () => {
		test("closes the open overlay and consumes the press", async () => {
			const back = spyOnBackButton();
			const onClose = jest.fn();
			await renderHook(() => useOverlayBackHandler(true, onClose));

			expect(back.press()).toBe(true);
			expect(onClose).toHaveBeenCalledTimes(1);
		});

		test("does nothing while the overlay is closed: the screen handles back", async () => {
			const back = spyOnBackButton();
			const onClose = jest.fn();
			await renderHook(() => useOverlayBackHandler(false, onClose));

			expect(back.press()).toBe(false);
			expect(onClose).not.toHaveBeenCalled();
		});

		test("stops listening once the overlay closes or unmounts", async () => {
			const back = spyOnBackButton();
			const { rerender, unmount } = await renderHook(
				({ open }: Props) => useOverlayBackHandler(open, () => {}),
				{ initialProps: { open: true } },
			);
			expect(back.count).toBe(1);

			await rerender({ open: false });
			expect(back.count).toBe(0);

			await rerender({ open: true });
			await unmount();
			expect(back.count).toBe(0);
		});

		test("calls the latest onClose without subscribing again", async () => {
			const back = spyOnBackButton();
			const first = jest.fn();
			const second = jest.fn();
			const { rerender } = await renderHook(
				({ open, onClose }: Props) => useOverlayBackHandler(open, onClose),
				{ initialProps: { open: true, onClose: first } as Props },
			);

			await rerender({ open: true, onClose: second });
			back.press();

			expect(first).not.toHaveBeenCalled();
			expect(second).toHaveBeenCalledTimes(1);
			expect(BackHandler.addEventListener).toHaveBeenCalledTimes(1);
		});

		test("an overlay that can't be dismissed still consumes the press", async () => {
			const back = spyOnBackButton();
			await renderHook(() => useOverlayBackHandler(true, undefined));

			expect(back.press()).toBe(true);
		});
	});

	describe("inside a screen", () => {
		test("blocks the native dismissal only while open", async () => {
			spyOnBackButton();
			const screen = screenOf();
			const { rerender, unmount } = await renderHook(
				({ open }: Props) => useOverlayBackHandler(open, () => {}),
				{ initialProps: { open: true }, wrapper: screen.wrapper },
			);

			expect(screen.setPreventRemove).toHaveBeenLastCalledWith(expect.any(String), "screen-1", true);
			await rerender({ open: false });
			expect(screen.setPreventRemove).toHaveBeenLastCalledWith(expect.any(String), "screen-1", false);

			await rerender({ open: true });
			await unmount();
			expect(screen.setPreventRemove).toHaveBeenLastCalledWith(expect.any(String), "screen-1", false);
		});

		test("a back gesture closes the overlay and keeps the screen", async () => {
			spyOnBackButton();
			const screen = screenOf();
			const onClose = jest.fn();
			await renderHook(() => useOverlayBackHandler(true, onClose), { wrapper: screen.wrapper });

			const event = screen.leave();
			await advance(16);

			expect(event.preventDefault).toHaveBeenCalled();
			expect(onClose).toHaveBeenCalledTimes(1);
			expect(screen.navigation.dispatch).not.toHaveBeenCalled();
		});

		test("a press that closes the overlay and leaves the screen still leaves", async () => {
			spyOnBackButton();
			const screen = screenOf();
			const onClose = jest.fn();
			const { rerender } = await renderHook(
				({ open }: Props) => useOverlayBackHandler(open, onClose),
				{ initialProps: { open: true }, wrapper: screen.wrapper },
			);

			// `setOpen(false)` and `router.back()` in the same press: the close commits before the next frame.
			screen.leave();
			await rerender({ open: false });
			await advance(16);

			expect(onClose).not.toHaveBeenCalled();
			expect(screen.navigation.dispatch).toHaveBeenCalledWith(screen.action);
		});

		test("does not hold the screen while the overlay is closed", async () => {
			spyOnBackButton();
			const screen = screenOf();
			await renderHook(() => useOverlayBackHandler(false, () => {}), { wrapper: screen.wrapper });

			const event = screen.leave();

			expect(event.preventDefault).not.toHaveBeenCalled();
		});
	});

	test("outside a screen, only the back button is handled, without throwing", async () => {
		const back = spyOnBackButton();
		const onClose = jest.fn();
		await renderHook(() => useOverlayBackHandler(true, onClose));

		back.press();

		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
