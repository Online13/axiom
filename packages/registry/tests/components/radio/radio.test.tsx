import { Text } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { Radio, RadioGroup } from "@/components/ui/radio";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

function Plans(props: Partial<React.ComponentProps<typeof RadioGroup>>) {
	return (
		<RadioGroup accessibilityLabel="Plan" {...props}>
			<Radio value="free" label="Free" />
			<Radio value="pro" label="Pro" description="For teams" />
			<Radio value="max" label="Max" disabled />
		</RadioGroup>
	);
}

const radio = (name: string) => screen.getByRole("radio", { name });

describe("RadioGroup", () => {
	test("is a radiogroup named by its question, and leaves each radio reachable", async () => {
		await render(<Plans />);

		// A container, not one accessible element: VoiceOver would otherwise merge the radios into it.
		const group = screen.getByLabelText("Plan");
		expect(group).toHaveProp("accessibilityRole", "radiogroup");
		expect(screen.getAllByRole("radio")).toHaveLength(3);
	});

	test("checks exactly one radio: the one pressed last", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(<Plans onValueChange={onValueChange} />);

		await user.press(radio("Free"));
		await user.press(radio("Pro"));

		expect(radio("Pro")).toBeChecked();
		expect(radio("Free")).not.toBeChecked();
		expect(onValueChange.mock.calls).toEqual([["free"], ["pro"]]);
	});

	test("starts with nothing checked, or with defaultValue", async () => {
		const view = await render(<Plans />);
		expect(screen.getAllByRole("radio").filter((r) => r.props.accessibilityState?.checked)).toHaveLength(0);

		await view.unmount();
		await render(<Plans defaultValue="pro" />);
		expect(radio("Pro")).toBeChecked();
	});

	test("pressing the checked radio again is not a change, and plays no haptic", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(<Plans defaultValue="free" onValueChange={onValueChange} haptic="selection" />);

		await user.press(radio("Free"));

		expect(onValueChange).not.toHaveBeenCalled();
		expect(Haptics.selectionAsync).not.toHaveBeenCalled();
	});

	test("plays its haptic when the user picks another radio", async () => {
		const user = userEvent.setup();
		await render(<Plans defaultValue="free" haptic="selection" />);

		await user.press(radio("Pro"));

		expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
	});

	test("controlled: the checked radio follows value only", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		const view = await render(<Plans value="free" onValueChange={onValueChange} />);

		await user.press(radio("Pro"));
		expect(onValueChange).toHaveBeenCalledWith("pro");
		expect(radio("Free")).toBeChecked();

		await view.rerender(<Plans value="pro" onValueChange={onValueChange} />);
		expect(radio("Pro")).toBeChecked();
	});

	test("a disabled radio can't be picked; a disabled group disables them all", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		const view = await render(<Plans onValueChange={onValueChange} />);

		await user.press(radio("Max"));
		expect(radio("Max")).toBeDisabled();
		expect(radio("Free")).toBeEnabled();

		await view.rerender(<Plans disabled onValueChange={onValueChange} />);
		await user.press(radio("Free"));
		expect(radio("Free")).toBeDisabled();

		expect(onValueChange).not.toHaveBeenCalled();
	});

	test("a render function builds a custom row from the checked state", async () => {
		const user = userEvent.setup();
		await render(
			<RadioGroup>
				<Radio value="card" accessibilityLabel="Card">
					{({ checked }) => <Text>{checked ? "Card ✓" : "Card"}</Text>}
				</Radio>
			</RadioGroup>,
		);

		await user.press(radio("Card"));

		expect(screen.getByText("Card ✓")).toBeOnTheScreen();
	});

	test("a Radio outside a RadioGroup throws", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});

		await expect(render(<Radio value="lonely" label="Lonely" />)).rejects.toThrow(
			"Radio must be rendered inside a RadioGroup.",
		);
	});
});
