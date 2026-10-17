import { render, screen, userEvent, within } from "@testing-library/react-native";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Separator } from "@/components/ui/separator";

jest.useFakeTimers();

describe("ButtonGroup", () => {
	test("keeps each button independent: a press reaches only that button", async () => {
		const user = userEvent.setup();
		const onDay = jest.fn();
		const onWeek = jest.fn();
		await render(
			<ButtonGroup>
				<Button variant="ghost" onPress={onDay}>
					Day
				</Button>
				<Separator orientation="vertical" />
				<Button variant="ghost" onPress={onWeek}>
					Week
				</Button>
			</ButtonGroup>,
		);

		await user.press(screen.getByRole("button", { name: "Week" }));

		expect(onWeek).toHaveBeenCalledTimes(1);
		expect(onDay).not.toHaveBeenCalled();
	});

	test("keeps the order of its children and forwards its props to the root view", async () => {
		await render(
			<ButtonGroup testID="group" accessibilityLabel="Zoom" orientation="vertical" bordered>
				<Button>In</Button>
				<Button>Out</Button>
			</ButtonGroup>,
		);

		const group = screen.getByTestId("group");
		const buttons = within(group).getAllByRole("button");
		expect(buttons.map((button) => button.props.accessibilityLabel ?? "")).toHaveLength(2);
		expect(group).toHaveTextContent("InOut");
		expect(group).toHaveProp("accessibilityLabel", "Zoom");
	});

	test("selects nothing on its own: it is not a segmented control", async () => {
		const user = userEvent.setup();
		await render(
			<ButtonGroup>
				<Button>Day</Button>
				<Button>Week</Button>
			</ButtonGroup>,
		);

		await user.press(screen.getByRole("button", { name: "Week" }));

		expect(screen.getByRole("button", { name: "Week" })).not.toBeSelected();
	});
});
