import { render, screen, userEvent } from "@testing-library/react-native";

import { AppBar } from "@/components/ui/app-bar";
import { IconButton } from "@/components/ui/icon-button";

import { withInsets } from "../../utils/safe-area";
import { testWithInsets } from "../../utils/styling";

jest.useFakeTimers();

describe("AppBar", () => {
	test("lays out the row in the order written: back, title, actions", async () => {
		const user = userEvent.setup();
		const onBack = jest.fn();
		await render(
			<AppBar testID="bar">
				<AppBar.Row>
					<IconButton icon="arrow-left" accessibilityLabel="Back" onPress={onBack} />
					<AppBar.Center>
						<AppBar.Title>Inbox</AppBar.Title>
					</AppBar.Center>
					<IconButton icon="search" accessibilityLabel="Search" />
				</AppBar.Row>
			</AppBar>,
		);

		const buttons = screen.getAllByRole("button");
		expect(buttons.map((b) => b.props.accessibilityLabel)).toEqual(["Back", "Search"]);
		await user.press(screen.getByRole("button", { name: "Back" }));
		expect(onBack).toHaveBeenCalledTimes(1);
	});

	test("the title is a header, on one line in the row", async () => {
		await render(
			<AppBar>
				<AppBar.Row>
					<AppBar.Center>
						<AppBar.Title>A very long screen title</AppBar.Title>
						<AppBar.Subtitle>3 unread</AppBar.Subtitle>
					</AppBar.Center>
				</AppBar.Row>
			</AppBar>,
		);

		expect(screen.getByRole("header", { name: "A very long screen title" })).toHaveProp(
			"numberOfLines",
			1,
		);
		expect(screen.getByText("3 unread")).toBeOnTheScreen();
	});

	test("a large title in the expanded block may wrap on two lines", async () => {
		await render(
			<AppBar>
				<AppBar.Expanded>
					<AppBar.Title size="large">Settings</AppBar.Title>
				</AppBar.Expanded>
			</AppBar>,
		);

		expect(screen.getByRole("header", { name: "Settings" })).toHaveProp("numberOfLines", 2);
	});

	testWithInsets("adds the top safe-area inset, unless told not to", async () => {
		const wrapper = withInsets({ top: 47 });
		const view = await render(<AppBar testID="bar" />, { wrapper });
		expect(screen.getByTestId("bar")).toHaveStyle({ paddingTop: 47 });

		await view.rerender(<AppBar testID="bar" safeArea={false} />);
		expect(screen.getByTestId("bar")).toHaveStyle({ paddingTop: 0 });
	});
});
