import { Dimensions, Text } from "react-native";
import { act, render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { Menu } from "@/components/ui/menu";
import { metrics, spacing } from "@/theme/tokens";

import { restoreBackButton, spyOnBackButton } from "../../utils/back-button";
import { layout, placeInWindow } from "../../utils/events";
import { advance } from "../../utils/time";

jest.useFakeTimers();

beforeEach(() => {
	jest.clearAllMocks();
	placeInWindow({ x: 20, y: 100, width: 44, height: 44 });
});
afterEach(restoreBackButton);

type Handlers = { onShare?: () => void; onArchive?: () => void; onDelete?: () => void; onPin?: () => void };

function More({ onShare, onArchive, onDelete, onPin, ...content }: Handlers & Partial<React.ComponentProps<typeof Menu.Content>>) {
	return (
		<Menu.Root>
			<Menu.Trigger accessibilityRole="button" accessibilityLabel="More" haptic="light">
				<Text>⋯</Text>
			</Menu.Trigger>
			<Menu.Content testID="menu" {...content}>
				<Menu.Item icon="share" onPress={onShare}>
					Share
				</Menu.Item>
				<Menu.Item subtitle="Hidden from the inbox" onPress={onArchive}>
					Archive
				</Menu.Item>
				<Menu.Item checked onPress={onPin} keepOpen>
					Pinned
				</Menu.Item>
				<Menu.Item disabled>Print</Menu.Item>
				<Menu.Separator />
				<Menu.Sub label="Move to">
					<Menu.Item>Work</Menu.Item>
					<Menu.Item>Personal</Menu.Item>
				</Menu.Sub>
				<Menu.Item destructive onPress={onDelete}>
					Delete
				</Menu.Item>
			</Menu.Content>
		</Menu.Root>
	);
}

async function openMenu(props: Handlers & Partial<React.ComponentProps<typeof Menu.Content>> = {}) {
	const user = userEvent.setup();
	await render(<More {...props} />);
	await user.press(screen.getByRole("button", { name: "More" }));
	return user;
}

const item = (name: string) => screen.getByRole("menuitem", { name });
/** Mounted at all: a closed menu unmounts after its exit. */
const isOpen = () => screen.queryByTestId("menu", { includeHiddenElements: true }) !== null;

describe("Menu", () => {
	test("opens from its trigger, with a haptic, as a modal list of menu items", async () => {
		await openMenu();

		expect(screen.getByTestId("menu")).toHaveProp("accessibilityRole", "menu");
		expect(screen.getByTestId("menu")).toHaveProp("accessibilityViewIsModal", true);
		expect(screen.getAllByRole("menuitem").length).toBeGreaterThanOrEqual(5);
		expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
	});

	test("an item's subtitle is read with its label", async () => {
		await openMenu();

		expect(item("Archive, Hidden from the inbox")).toBeOnTheScreen();
	});

	test("picking an item closes the menu, then runs its action", async () => {
		const onShare = jest.fn();
		const user = await openMenu({ onShare });

		await user.press(item("Share"));
		await advance(200);

		expect(isOpen()).toBe(false);
		expect(onShare).toHaveBeenCalledTimes(1);
	});

	test("a keepOpen item runs and leaves the menu open", async () => {
		const onPin = jest.fn();
		const user = await openMenu({ onPin });

		await user.press(item("Pinned"));
		await advance(200);

		expect(onPin).toHaveBeenCalledTimes(1);
		expect(isOpen()).toBe(true);
	});

	test("a checked item reports it", async () => {
		await openMenu();

		// `toBeChecked` doesn't take a menuitem: read the state screen readers get.
		expect(item("Pinned")).toHaveProp("accessibilityState", expect.objectContaining({ checked: true }));
		expect(item("Share").props.accessibilityState?.checked).toBeUndefined();
	});

	test("a disabled item can't be picked", async () => {
		const user = await openMenu();

		await user.press(item("Print"));
		await advance(200);

		expect(item("Print")).toBeDisabled();
		expect(isOpen()).toBe(true);
	});

	test("a submenu opens in place, with a back item named after it", async () => {
		const user = await openMenu();

		await user.press(item("Move to"));
		expect(item("Work")).toBeOnTheScreen();
		expect(screen.queryByRole("menuitem", { name: "Share" })).toBeNull();

		await user.press(item("Move to"));
		expect(item("Share")).toBeOnTheScreen();
	});

	test("reopening after a submenu starts at the top level", async () => {
		const user = await openMenu();
		await user.press(item("Move to"));
		await user.press(item("Work"));
		await advance(200);

		await user.press(screen.getByRole("button", { name: "More" }));

		expect(item("Share")).toBeOnTheScreen();
	});

	describe("dismissing", () => {
		test("a touch on the backdrop closes it without running any action", async () => {
			const onShare = jest.fn();
			const user = await openMenu({ onShare });

			await user.press(screen.getByRole("button", { name: "Close", includeHiddenElements: true }));
			await advance(200);

			expect(isOpen()).toBe(false);
			expect(onShare).not.toHaveBeenCalled();
		});

		test("the Android back button closes it", async () => {
			const back = spyOnBackButton();
			await openMenu();

			await act(() => expect(back.press()).toBe(true));
			await advance(200);

			expect(isOpen()).toBe(false);
		});
	});

	describe("placement", () => {
		const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
		const gap = spacing[2];
		const margin = metrics.screenMargin;

		async function openAt(rect: { x: number; y: number; width: number; height: number }, props = {}) {
			placeInWindow(rect);
			await openMenu(props);
			await layout(screen.getByTestId("menu"), { width: 250, height: 200 });
			return screen.getByTestId("menu");
		}

		test("below the trigger, aligned to its start", async () => {
			const menu = await openAt({ x: 20, y: 100, width: 44, height: 44 });

			expect(menu).toHaveStyle({ top: 100 + 44 + gap, left: 20, width: 250 });
		});

		test("above the trigger when there's no room below", async () => {
			const y = screenHeight - 100;
			const menu = await openAt({ x: 20, y, width: 44, height: 44 });

			expect(menu).toHaveStyle({ top: y - gap - 200 });
		});

		test("aligned to the trigger's end, and kept inside the screen margins", async () => {
			const menu = await openAt({ x: screenWidth - 60, y: 100, width: 44, height: 44 }, { align: "end" });
			expect(menu).toHaveStyle({ left: screenWidth - 60 + 44 - 250 });

			const clamped = await openAt({ x: 0, y: 100, width: 44, height: 44 }, { align: "end" });
			expect(clamped).toHaveStyle({ left: margin });
		});
	});

	test("parts outside Menu.Root throw a clear error", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});

		await expect(render(<Menu.Content />)).rejects.toThrow("Menu parts must be rendered inside Menu.Root.");
	});
});
