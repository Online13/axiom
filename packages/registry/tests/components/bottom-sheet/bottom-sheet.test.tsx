import { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { act, fireEvent, render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { GestureDetector } from "react-native-gesture-handler";
import { fireGestureHandler } from "react-native-gesture-handler/jest-utils";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { BottomSheetRoot } from "@/components/ui/bottom-sheet/bottom-sheet-root";
import {
	useBottomSheetContent,
	type UseBottomSheetContentOptions,
} from "@/components/ui/bottom-sheet/use-bottom-sheet";

import { restoreBackButton, spyOnBackButton } from "../../utils/back-button";
import { layout } from "../../utils/events";
import { advance } from "../../utils/time";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());
afterEach(restoreBackButton);

type Props = Partial<React.ComponentProps<typeof BottomSheet.Content>> & {
	onOpenChange?: (open: boolean) => void;
	open?: boolean;
};

function Filters({ onOpenChange, open, ...content }: Props) {
	return (
		<BottomSheet.Root open={open} onOpenChange={onOpenChange}>
			<BottomSheet.Trigger accessibilityRole="button" accessibilityLabel="Filters">
				<Text>Filters</Text>
			</BottomSheet.Trigger>
			<BottomSheet.Content testID="sheet" {...content}>
				<BottomSheet.Handle />
				<BottomSheet.Header title="Filters" closeButton />
				<Text>Price range</Text>
			</BottomSheet.Content>
		</BottomSheet.Root>
	);
}

/** Opens the sheet and measures its content, as the first layout on a device does. */
async function openSheet(props: Props = {}, contentHeight = 320) {
	const user = userEvent.setup();
	const view = await render(<Filters {...props} />);
	await user.press(screen.getByRole("button", { name: "Filters" }));
	await layout(screen.getByText("Price range").parent!, { width: 390, height: contentHeight });
	return { user, view };
}

/** Mounted at all: a closed sheet unmounts after its exit. */
const isOpen = () => screen.queryByText("Price range", { includeHiddenElements: true }) !== null;

describe("BottomSheet", () => {
	test("renders nothing until its trigger opens it", async () => {
		const onOpenChange = jest.fn();
		await render(<Filters onOpenChange={onOpenChange} />);
		expect(isOpen()).toBe(false);

		await userEvent.setup().press(screen.getByRole("button", { name: "Filters" }));

		expect(isOpen()).toBe(true);
		expect(onOpenChange).toHaveBeenCalledWith(true);
		expect(screen.getByTestId("sheet")).toHaveProp("accessibilityViewIsModal", true);
	});

	test("the header's close button closes it; it unmounts after the exit and calls onDismiss", async () => {
		const onOpenChange = jest.fn();
		const onDismiss = jest.fn();
		const { user } = await openSheet({ onOpenChange, onDismiss });

		await user.press(screen.getByRole("button", { name: "Close" }));
		await advance(400);

		expect(onOpenChange).toHaveBeenLastCalledWith(false);
		expect(isOpen()).toBe(false);
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	test("the Android back button closes it instead of leaving the screen", async () => {
		const back = spyOnBackButton();
		await openSheet();

		await act(() => expect(back.press()).toBe(true));
		await advance(400);

		expect(isOpen()).toBe(false);
	});

	test("dismissible={false}: back is consumed, the backdrop doesn't close it", async () => {
		const back = spyOnBackButton();
		await openSheet({ dismissible: false });

		await act(() => expect(back.press()).toBe(true));
		await advance(400);

		expect(isOpen()).toBe(true);
		// Only the header's close button is left: the backdrop is no button anymore.
		expect(screen.getAllByRole("button", { name: "Close", includeHiddenElements: true })).toHaveLength(1);
	});

	describe("height", () => {
		test("fits its content once measured", async () => {
			await openSheet({}, 320);

			expect(screen.getByTestId("sheet")).toHaveStyle({ height: 320 });
		});

		test("takes the highest snap point, as a share of the screen", async () => {
			await openSheet({ snapPoints: ["25%", "50%"] });

			expect(screen.getByTestId("sheet")).toHaveStyle({ height: Dimensions.get("window").height / 2 });
		});

		test("never grows past the screen", async () => {
			await openSheet({ snapPoints: [100_000] });

			expect(screen.getByTestId("sheet")).toHaveStyle({ height: Dimensions.get("window").height });
		});
	});

	describe("handle", () => {
		test("is adjustable: screen readers move the sheet between snap points", async () => {
			const onIndexChange = jest.fn();
			await openSheet({ snapPoints: [200, 400, 600], onIndexChange });
			const handle = screen.getByRole("adjustable", { name: "Resize sheet" });

			await fireEvent(handle, "accessibilityAction", { nativeEvent: { actionName: "increment" } });
			expect(onIndexChange).toHaveBeenLastCalledWith(1);

			await fireEvent(handle, "accessibilityAction", { nativeEvent: { actionName: "increment" } });
			await fireEvent(handle, "accessibilityAction", { nativeEvent: { actionName: "increment" } });
			expect(onIndexChange).toHaveBeenLastCalledWith(2);
			expect(onIndexChange).toHaveBeenCalledTimes(2);

			await fireEvent(handle, "accessibilityAction", { nativeEvent: { actionName: "decrement" } });
			expect(onIndexChange).toHaveBeenLastCalledWith(1);
		});
	});

	test("controlled: opens and closes with open", async () => {
		const view = await render(<Filters open={false} />);
		expect(isOpen()).toBe(false);

		await view.rerender(<Filters open />);
		expect(isOpen()).toBe(true);
		await layout(screen.getByText("Price range").parent!, { width: 390, height: 320 });

		await view.rerender(<Filters open={false} />);
		await advance(400);
		expect(isOpen()).toBe(false);
	});

	test("the footer is rendered with the content", async () => {
		await openSheet({ footer: <Text>Show 24 results</Text> });

		expect(screen.getByText("Show 24 results")).toBeOnTheScreen();
	});

	test("a sheet opened over another takes the screen reader and the back button", async () => {
		const back = spyOnBackButton();
		const user = userEvent.setup();
		function Stack() {
			const [second, setSecond] = useState(false);
			return (
				<>
					<BottomSheet.Root defaultOpen>
						<BottomSheet.Content testID="first">
							<BottomSheet.Trigger accessibilityRole="button" accessibilityLabel="Sort" onPress={() => setSecond(true)} />
						</BottomSheet.Content>
					</BottomSheet.Root>
					<BottomSheet.Root open={second} onOpenChange={setSecond}>
						<BottomSheet.Content testID="second">
							<Text>Sort by</Text>
						</BottomSheet.Content>
					</BottomSheet.Root>
				</>
			);
		}
		await render(<Stack />);

		await user.press(screen.getByRole("button", { name: "Sort" }));
		await layout(screen.getByText("Sort by").parent!, { width: 390, height: 200 });
		expect(screen.getByTestId("second")).toHaveProp("accessibilityViewIsModal", true);
		expect(screen.getByTestId("first", { includeHiddenElements: true })).toHaveProp("importantForAccessibility", "no-hide-descendants");

		await act(() => back.press());
		await advance(400);
		expect(screen.queryByText("Sort by", { includeHiddenElements: true })).toBeNull();
		expect(screen.getByTestId("first")).toHaveProp("accessibilityViewIsModal", true);
	});

	test("parts outside their parent throw a clear error", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});

		await expect(render(<BottomSheet.Content />)).rejects.toThrow(
			"BottomSheet parts must be rendered inside BottomSheet.Root.",
		);
		await expect(render(<BottomSheet.Handle />)).rejects.toThrow(
			"This part must be rendered inside BottomSheet.Content.",
		);
	});
});

describe("useBottomSheetContent: dragging", () => {
	type Sheet = ReturnType<typeof useBottomSheetContent>;

	function Harness({ onRender, ...options }: UseBottomSheetContentOptions & { onRender: (s: Sheet) => void }) {
		const sheet = useBottomSheetContent(options);
		onRender(sheet);
		return (
			<GestureDetector gesture={sheet.gesture}>
				<View />
			</GestureDetector>
		);
	}

	// Snap points of 200 and 400pt: the sheet rests 200pt down at index 0, at the top at index 1,
	// and is closed 400pt down.
	async function setup(options: UseBottomSheetContentOptions = {}) {
		const onOpenChange = jest.fn();
		const onIndexChange = jest.fn();
		let sheet!: Sheet;
		const ui = () => (
			<BottomSheetRoot defaultOpen onOpenChange={onOpenChange}>
				<Harness snapPoints={[200, 400]} onIndexChange={onIndexChange} {...options} onRender={(s) => (sheet = s)} />
			</BottomSheetRoot>
		);
		const view = await render(ui());
		await advance(0);
		return {
			onOpenChange,
			onIndexChange,
			index: () => sheet.context.index,
			drag: async (translationY: number, velocityY = 0) => {
				fireGestureHandler(sheet.gesture, [
					{ translationY: 0 },
					{ translationY },
					{ translationY, velocityY },
				]);
				await advance(400);
				// RNGH's test utils only fire a gesture again once its detector re-attaches it, which a
				// render does. On a device, every touch is a new gesture.
				await view.rerender(ui());
			},
		};
	}

	test("dragging up lands on the higher snap point", async () => {
		const { drag, onIndexChange, index } = await setup();

		await drag(-150);

		expect(onIndexChange).toHaveBeenCalledWith(1);
		expect(index()).toBe(1);
	});

	test("a short drag goes back to where it was", async () => {
		const { drag, onIndexChange } = await setup();

		await drag(-60);

		expect(onIndexChange).not.toHaveBeenCalled();
	});

	test("dragging down past the middle of the last gap closes it", async () => {
		const { drag, onOpenChange } = await setup();

		await drag(150);

		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	test("a fling closes it even after a short drag", async () => {
		const { drag, onOpenChange } = await setup();

		await drag(30, 2000);

		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	test("not dismissible: it stops at the lowest snap point and stays open", async () => {
		const { drag, onOpenChange, index } = await setup({ dismissible: false });

		await drag(400, 2000);

		expect(onOpenChange).not.toHaveBeenCalled();
		expect(index()).toBe(0);
	});

	test("plays its haptic when a drag lands on another snap point, not when it springs back", async () => {
		const { drag } = await setup({ haptic: "light" });

		await drag(-60);
		expect(Haptics.impactAsync).not.toHaveBeenCalled();

		await drag(-150);
		expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
	});
});
