import { View, AccessibilityInfo } from "react-native";
import { act, render, screen, userEvent } from "@testing-library/react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { fireGestureHandler } from "react-native-gesture-handler/jest-utils";

import { toast, Toaster } from "@/components/ui/toast";
import { useToastItem, useToasts } from "@/components/ui/toast/use-toast";

import { pressIn, pressOut } from "../../utils/events";
import { advance } from "../../utils/time";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

// Toasts live in a module-level store: close them all, so the next test starts empty.
afterEach(async () => {
	await act(() => toast.dismiss());
	await advance(500);
});

/** The toast surfaces on screen, newest first. */
const shown = () =>
	screen.queryAllByRole(/summary|alert/).map((element) => element.props.accessibilityLabel as string).reverse();

async function show(fn: () => unknown) {
	await act(() => {
		fn();
	});
}

/** Mounts the UI, then lets the closed leftovers of the previous test play their exit and leave. */
async function mount(ui: React.ReactElement) {
	const view = await render(ui);
	await advance(300);
	return view;
}

describe("Toaster", () => {
	test("renders nothing while there is no toast", async () => {
		await mount(<Toaster />);

		expect(screen.toJSON()).toBeNull();
	});

	test("shows a toast named by its title and description, and announces it", async () => {
		await mount(<Toaster />);

		await show(() => toast.success("Saved", { description: "Your changes are live." }));

		expect(screen.getByRole("summary", { name: "Saved. Your changes are live." })).toBeOnTheScreen();
		expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith("Saved. Your changes are live.");
	});

	test("an error toast is an alert", async () => {
		await mount(<Toaster />);

		await show(() => toast.error("Upload failed"));

		expect(screen.getByRole("alert", { name: "Upload failed" })).toBeOnTheScreen();
	});

	describe("timing", () => {
		test("leaves after 4 seconds, then calls onDismiss", async () => {
			const onDismiss = jest.fn();
			await mount(<Toaster />);
			await show(() => toast.show({ title: "Copied", onDismiss }));

			await advance(3_999);
			expect(shown()).toEqual(["Copied"]);

			await advance(500);
			expect(shown()).toEqual([]);
			expect(onDismiss).toHaveBeenCalledTimes(1);
		});

		test("honors its own duration, and Infinity keeps it", async () => {
			await mount(<Toaster />);
			await show(() => toast.show({ title: "Quick", duration: 1000 }));
			await show(() => toast.show({ title: "Sticky", duration: Infinity }));

			await advance(60_000);

			expect(shown()).toEqual(["Sticky"]);
		});

		test("a loading toast never times out", async () => {
			await mount(<Toaster />);

			await show(() => toast.loading("Uploading…"));
			await advance(60_000);

			expect(shown()).toEqual(["Uploading…"]);
		});

		test("holding a toast stops its timer, which restarts on release", async () => {
			await mount(<Toaster />);
			await show(() => toast.show({ title: "Held" }));
			const surface = screen.getByRole("summary", { name: "Held" });

			await advance(3_000);
			await pressIn(surface);
			await advance(10_000);
			expect(shown()).toEqual(["Held"]);

			await pressOut(surface);
			await advance(4_500);
			expect(shown()).toEqual([]);
		});
	});

	describe("updating", () => {
		test("showing an existing id updates that toast in place", async () => {
			await mount(<Toaster />);

			await show(() => toast.loading("Sending…", { id: "send" }));
			await show(() => toast.success("Sent", { id: "send" }));

			expect(shown()).toEqual(["Sent"]);
		});

		test("toast.promise goes from loading to the success message", async () => {
			let resolve!: (count: number) => void;
			await mount(<Toaster />);

			await show(() =>
				toast.promise(new Promise<number>((r) => (resolve = r)), {
					loading: "Importing…",
					success: (count) => `${count} contacts imported`,
					error: "Import failed",
				}),
			);
			expect(shown()).toEqual(["Importing…"]);

			await act(async () => resolve(12));

			expect(shown()).toEqual(["12 contacts imported"]);
			expect(screen.getByRole("summary", { name: "12 contacts imported" })).toBeOnTheScreen();
		});

		test("toast.promise shows the error message when it rejects, and still rejects", async () => {
			await mount(<Toaster />);
			const failing = Promise.reject(new Error("offline"));

			await show(() => toast.promise(failing, { loading: "Importing…", success: "Done", error: (e) => `Failed: ${(e as Error).message}` }).catch(() => {}));
			await act(async () => {});

			expect(screen.getByRole("alert", { name: "Failed: offline" })).toBeOnTheScreen();
		});
	});

	describe("dismissing", () => {
		test("toast.dismiss(id) closes that toast only; toast.dismiss() closes them all", async () => {
			await mount(<Toaster />);
			let first = "";
			await show(() => (first = toast.show({ title: "One", duration: Infinity })));
			await show(() => toast.show({ title: "Two", duration: Infinity }));

			await act(() => toast.dismiss(first));
			await advance(300);
			expect(shown()).toEqual(["Two"]);

			await act(() => toast.dismiss());
			await advance(300);
			expect(shown()).toEqual([]);
		});
	});

	describe("stack", () => {
		test("shows the 3 newest; older ones wait hidden, and come forward when one leaves", async () => {
			await mount(<Toaster />);
			let oldest = "";
			await show(() => (oldest = toast.show({ title: "1", duration: Infinity })));
			for (const title of ["2", "3", "4"]) await show(() => toast.show({ title, duration: Infinity }));

			expect(shown()).toEqual(["4", "3", "2"]);

			// The 4th is in the tree, but hidden from screen readers until there is room.
			expect(screen.getAllByRole("summary", { includeHiddenElements: true })).toHaveLength(4);

			await act(() => toast.dismiss(oldest));
			await advance(300);
			expect(screen.getAllByRole("summary", { includeHiddenElements: true })).toHaveLength(3);

			await act(() => toast.show({ title: "5", duration: Infinity }));
			expect(shown()).toEqual(["5", "4", "3"]);
		});

		test("a press on a stack expands it and pauses the timers; a press on an expanded toast runs its onPress", async () => {
			const user = userEvent.setup();
			const onPress = jest.fn();
			await mount(<Toaster />);
			await show(() => toast.show({ title: "Older" }));
			await show(() => toast.show({ title: "Newer", onPress }));

			await user.press(screen.getByRole("summary", { name: "Newer" }));
			expect(onPress).not.toHaveBeenCalled();
			await advance(10_000);
			expect(shown()).toEqual(["Newer", "Older"]);

			await user.press(screen.getByRole("summary", { name: "Newer" }));
			expect(onPress).toHaveBeenCalledTimes(1);
		});

		test("a single toast runs its onPress at once", async () => {
			const user = userEvent.setup();
			const onPress = jest.fn();
			await mount(<Toaster />);
			await show(() => toast.show({ title: "Open", onPress }));

			await user.press(screen.getByRole("summary", { name: "Open" }));

			expect(onPress).toHaveBeenCalledTimes(1);
		});
	});
});

describe("useToastItem: swipe up to dismiss", () => {
	function Harness({ swipeToDismiss = true }: { swipeToDismiss?: boolean }) {
		const toasts = useToasts();
		const item = toasts[0];
		return item ? <Item key={item.id} data={item} swipeToDismiss={swipeToDismiss} /> : null;
	}
	let gesture: ReturnType<typeof useToastItem>["gesture"];
	function Item({ data, swipeToDismiss }: { data: ReturnType<typeof useToasts>[number]; swipeToDismiss: boolean }) {
		const item = useToastItem({ toast: data, index: 0, offset: 0, scale: 1, hidden: false, paused: false, swipeToDismiss });
		gesture = item.gesture;
		return (
			<GestureDetector gesture={item.gesture}>
				<View testID={data.title} />
			</GestureDetector>
		);
	}

	async function swipe(translationY: number, velocityY = 0) {
		fireGestureHandler(gesture, [{ translationY: 0 }, { translationY }, { translationY, velocityY }]);
		await advance(300);
	}

	test("a swipe up dismisses it", async () => {
		const onDismiss = jest.fn();
		await mount(<Harness />);
		await show(() => toast.show({ title: "Swipe me", duration: Infinity, onDismiss }));

		await swipe(-40);

		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	test("a short or downward swipe keeps it", async () => {
		const onDismiss = jest.fn();
		await mount(<Harness />);
		await show(() => toast.show({ title: "Stay", duration: Infinity, onDismiss }));

		await swipe(-10);
		await swipe(80);

		expect(onDismiss).not.toHaveBeenCalled();
		expect(screen.getByTestId("Stay")).toBeOnTheScreen();
	});

	test("a quick flick up dismisses it even when short", async () => {
		const onDismiss = jest.fn();
		await mount(<Harness />);
		await show(() => toast.show({ title: "Flick", duration: Infinity, onDismiss }));

		await swipe(-10, -900);

		expect(onDismiss).toHaveBeenCalledTimes(1);
	});
});
