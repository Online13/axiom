import { AccessibilityInfo, View } from "react-native";
import { act, render, screen, userEvent } from "@testing-library/react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { fireGestureHandler } from "react-native-gesture-handler/jest-utils";

import { snackbar, SnackbarHost } from "@/components/ui/snackbar";
import { useSnackbarItem, useSnackbars } from "@/components/ui/snackbar/use-snackbar";

import { advance } from "../../utils/time";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

// Snackbars live in a module-level store: close the current one, so the next test starts empty.
afterEach(async () => {
	await act(() => snackbar.dismiss());
	await advance(500);
});

async function show(options: Parameters<typeof snackbar.show>[0]) {
	await act(() => {
		snackbar.show(options);
	});
}

/** Mounts the UI, then lets the closed leftovers of the previous test play their exit and leave. */
async function mount(ui: React.ReactElement) {
	const view = await render(ui);
	await advance(300);
	return view;
}

describe("SnackbarHost", () => {
	test("renders nothing while there is no snackbar", async () => {
		await mount(<SnackbarHost />);

		expect(screen.toJSON()).toBeNull();
	});

	test("shows the message and announces it, with its action", async () => {
		await mount(<SnackbarHost />);

		await show({ message: "Message archived", action: { label: "Undo", onPress: () => {} } });

		expect(screen.getByText("Message archived")).toBeOnTheScreen();
		expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith("Message archived. Undo available");
	});

	test("the action runs, closes it, and reports 'action' so the change isn't committed", async () => {
		const user = userEvent.setup();
		const onUndo = jest.fn();
		const onDismiss = jest.fn();
		await mount(<SnackbarHost />);
		await show({ message: "Message deleted", action: { label: "Undo", onPress: onUndo }, onDismiss });

		await user.press(screen.getByRole("button", { name: "Undo" }));
		await advance(300);

		expect(onUndo).toHaveBeenCalledTimes(1);
		expect(onDismiss).toHaveBeenCalledWith("action");
		expect(screen.queryByText("Message deleted")).toBeNull();
	});

	describe("timing", () => {
		test("a plain message leaves after 4 seconds, reporting 'timeout'", async () => {
			const onDismiss = jest.fn();
			await mount(<SnackbarHost />);
			await show({ message: "Saved", onDismiss });

			await advance(3_999);
			expect(onDismiss).not.toHaveBeenCalled();

			await advance(300);
			expect(onDismiss).toHaveBeenCalledWith("timeout");
		});

		test("with an action it stays 8 seconds, to give time to undo", async () => {
			const onDismiss = jest.fn();
			await mount(<SnackbarHost />);
			await show({ message: "Deleted", action: { label: "Undo", onPress: () => {} }, onDismiss });

			await advance(7_999);
			expect(onDismiss).not.toHaveBeenCalled();

			await advance(300);
			expect(onDismiss).toHaveBeenCalledWith("timeout");
		});

		test("indefinite stays until dismissed; a number is in ms", async () => {
			const onDismiss = jest.fn();
			await mount(<SnackbarHost />);
			await show({ message: "Offline", duration: "indefinite", onDismiss });
			await advance(60_000);
			expect(onDismiss).not.toHaveBeenCalled();

			await act(() => snackbar.dismiss());
			await advance(300);
			expect(onDismiss).toHaveBeenCalledWith("dismiss");
		});

		test("doubles its time while a screen reader runs", async () => {
			jest.mocked(AccessibilityInfo.isScreenReaderEnabled).mockResolvedValueOnce(true);
			const onDismiss = jest.fn();
			await mount(<SnackbarHost />);
			await show({ message: "Saved", onDismiss });
			await act(async () => {});

			await advance(5_000);
			expect(onDismiss).not.toHaveBeenCalled();

			await advance(3_500);
			expect(onDismiss).toHaveBeenCalledWith("timeout");
		});
	});

	test("a new snackbar replaces the current one, which reports 'replaced'", async () => {
		const onFirstDismiss = jest.fn();
		await mount(<SnackbarHost />);
		await show({ message: "First", onDismiss: onFirstDismiss });

		await show({ message: "Second" });
		await advance(300);

		expect(onFirstDismiss).toHaveBeenCalledWith("replaced");
		expect(screen.queryByText("First")).toBeNull();
		expect(screen.getByText("Second")).toBeOnTheScreen();
	});

	test("is a polite live region", async () => {
		await mount(<SnackbarHost />);
		await show({ message: "Copied" });

		const regions = screen.container.queryAll((node) => node.props.accessibilityLiveRegion === "polite");
		expect(regions).toHaveLength(1);
		expect(regions[0]).toHaveTextContent("Copied");
	});
});

describe("useSnackbarItem: swipe to dismiss", () => {
	let gesture: ReturnType<typeof useSnackbarItem>["gesture"];
	function Item({ data }: { data: ReturnType<typeof useSnackbars>[number] }) {
		const item = useSnackbarItem(data, true);
		gesture = item.gesture;
		return (
			<GestureDetector gesture={item.gesture}>
				<View />
			</GestureDetector>
		);
	}
	function Harness() {
		const items = useSnackbars();
		return (
			<>
				{items.map((data) => (
					<Item key={data.id} data={data} />
				))}
			</>
		);
	}

	async function swipe(event: { translationX?: number; translationY?: number; velocityX?: number; velocityY?: number }) {
		const { translationX = 0, translationY = 0 } = event;
		fireGestureHandler(gesture, [{ translationX: 0, translationY: 0 }, { translationX, translationY }, { ...event, translationX, translationY }]);
		await advance(300);
	}

	test("a swipe down dismisses it, reporting 'swipe'", async () => {
		const onDismiss = jest.fn();
		await mount(<Harness />);
		await show({ message: "Swipe", duration: "indefinite", onDismiss });

		await swipe({ translationY: 40 });

		expect(onDismiss).toHaveBeenCalledWith("swipe");
	});

	test("a swipe sideways past 30% of the screen dismisses it", async () => {
		const onDismiss = jest.fn();
		await mount(<Harness />);
		await show({ message: "Swipe", duration: "indefinite", onDismiss });

		await swipe({ translationX: 400 });

		expect(onDismiss).toHaveBeenCalledWith("swipe");
	});

	test("a short swipe keeps it", async () => {
		const onDismiss = jest.fn();
		await mount(<Harness />);
		await show({ message: "Stay", duration: "indefinite", onDismiss });

		await swipe({ translationX: 40 });

		expect(onDismiss).not.toHaveBeenCalled();
	});
});
