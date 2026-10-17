import { render, screen, userEvent } from "@testing-library/react-native";

import { InputGroup } from "@/components/ui/input-group";

jest.useFakeTimers();

function Phone(props: { disabled?: boolean; onCountry?: () => void; onSend?: () => void }) {
	return (
		<InputGroup disabled={props.disabled}>
			<InputGroup.Addon onPress={props.onCountry} accessibilityLabel="Country, France">
				+33
			</InputGroup.Addon>
			<InputGroup.Separator testID="separator" />
			<InputGroup.Input placeholder="Phone number" keyboardType="phone-pad" />
			<InputGroup.Button onPress={props.onSend}>Send</InputGroup.Button>
		</InputGroup>
	);
}

describe("InputGroup", () => {
	test("the input is named by its placeholder when it has no label", async () => {
		const user = userEvent.setup();
		await render(<Phone />);

		await user.type(screen.getByLabelText("Phone number"), "612");

		expect(screen.getByLabelText("Phone number")).toHaveDisplayValue("612");
	});

	test("a pressable addon is a button; the group's button works on its own", async () => {
		const user = userEvent.setup();
		const onCountry = jest.fn();
		const onSend = jest.fn();
		await render(<Phone onCountry={onCountry} onSend={onSend} />);

		await user.press(screen.getByRole("button", { name: "Country, France" }));
		await user.press(screen.getByRole("button", { name: "Send" }));

		expect(onCountry).toHaveBeenCalledTimes(1);
		expect(onSend).toHaveBeenCalledTimes(1);
	});

	test("a static addon is plain text, not a button", async () => {
		await render(
			<InputGroup>
				<InputGroup.Input accessibilityLabel="Amount" />
				<InputGroup.Addon>kg</InputGroup.Addon>
			</InputGroup>,
		);

		expect(screen.queryByRole("button")).toBeNull();
		expect(screen.getByText("kg")).toBeOnTheScreen();
	});

	test("a disabled group disables every part", async () => {
		const user = userEvent.setup();
		const onCountry = jest.fn();
		const onSend = jest.fn();
		await render(<Phone disabled onCountry={onCountry} onSend={onSend} />);

		await user.press(screen.getByRole("button", { name: "Country, France" }));
		await user.press(screen.getByRole("button", { name: "Send" }));

		expect(onCountry).not.toHaveBeenCalled();
		expect(onSend).not.toHaveBeenCalled();
		expect(screen.getByLabelText("Phone number")).toHaveProp("editable", false);
	});

	test("one input can be disabled on its own", async () => {
		await render(
			<InputGroup>
				<InputGroup.Input accessibilityLabel="Street" />
				<InputGroup.Input accessibilityLabel="Zip" disabled />
			</InputGroup>,
		);

		expect(screen.getByLabelText("Street")).toHaveProp("editable", true);
		expect(screen.getByLabelText("Zip")).toHaveProp("editable", false);
	});

	test("the separator is hidden from screen readers", async () => {
		await render(<Phone />);

		expect(screen.queryByTestId("separator")).toBeNull();
	});

	test("parts outside an InputGroup throw a clear error", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});

		await expect(render(<InputGroup.Input accessibilityLabel="Lonely" />)).rejects.toThrow(
			"This part must be rendered inside InputGroup.",
		);
	});
});
