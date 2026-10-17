import { Keyboard } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { BottomTabBar } from "@/components/ui/bottom-tab-bar";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

function Tabs(props: Partial<React.ComponentProps<typeof BottomTabBar>>) {
	return (
		<BottomTabBar defaultValue="home" testID="bar" {...props}>
			<BottomTabBar.Item value="home" label="Home" icon="file" />
			<BottomTabBar.Item value="search" label="Search" icon="search" />
			<BottomTabBar.Item value="inbox" label="Inbox" icon="notifications" badge={3} />
			<BottomTabBar.Item value="settings" label="Settings" icon="settings" disabled />
		</BottomTabBar>
	);
}

const tab = (name: string) => screen.getByRole("tab", { name });

describe("BottomTabBar", () => {
	test("is a tablist of tabs, the active one selected", async () => {
		await render(<Tabs />);

		expect(screen.getByTestId("bar")).toHaveProp("accessibilityRole", "tablist");
		expect(screen.getAllByRole("tab")).toHaveLength(4);
		expect(tab("Home")).toBeSelected();
		expect(tab("Search")).not.toBeSelected();
	});

	test("pressing another tab selects it and reports it", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(<Tabs onValueChange={onValueChange} />);

		await user.press(tab("Search"));

		expect(onValueChange).toHaveBeenCalledWith("search");
		expect(tab("Search")).toBeSelected();
		expect(tab("Home")).not.toBeSelected();
	});

	test("pressing the active tab again does nothing", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(<Tabs onValueChange={onValueChange} haptic="selection" />);

		await user.press(tab("Home"));

		expect(onValueChange).not.toHaveBeenCalled();
		expect(Haptics.selectionAsync).not.toHaveBeenCalled();
	});

	test("switching tabs dismisses the keyboard and plays the haptic", async () => {
		const user = userEvent.setup();
		const dismiss = jest.spyOn(Keyboard, "dismiss");
		await render(<Tabs haptic="selection" />);

		await user.press(tab("Search"));

		expect(dismiss).toHaveBeenCalled();
		expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
	});

	test("a disabled tab can't be selected", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(<Tabs onValueChange={onValueChange} />);

		await user.press(tab("Settings"));

		expect(onValueChange).not.toHaveBeenCalled();
		expect(tab("Settings")).toBeDisabled();
	});

	test("controlled: the selected tab follows the route", async () => {
		const user = userEvent.setup();
		const view = await render(<Tabs value="home" />);

		await user.press(tab("Inbox"));
		expect(tab("Home")).toBeSelected();

		await view.rerender(<Tabs value="inbox" />);
		expect(tab("Inbox")).toBeSelected();
	});

	test("shows a badge counter, capped at 99+", async () => {
		const view = await render(<Tabs />);
		expect(tab("Inbox")).toHaveTextContent("3Inbox");

		await view.rerender(
			<BottomTabBar defaultValue="home">
				<BottomTabBar.Item value="inbox" label="Inbox" icon="notifications" badge={120} />
			</BottomTabBar>,
		);
		expect(tab("Inbox")).toHaveTextContent("99+Inbox");
	});

	test("an Item outside a BottomTabBar throws", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});

		await expect(
			render(<BottomTabBar.Item value="home" label="Home" icon="file" />),
		).rejects.toThrow("BottomTabBar.Item must be used inside <BottomTabBar>.");
	});
});
