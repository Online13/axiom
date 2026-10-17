import { createRef } from "react";
import type { TextInput } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";

import { Field, Input } from "@/components/ui/input";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

/** The text field: RNTL finds a TextInput by its accessible name like any other element. */
const field = (name: string) => screen.getByLabelText(name);

describe("Input", () => {
	test("typing reports each change and shows the text", async () => {
		const user = userEvent.setup();
		const onChangeText = jest.fn();
		await render(<Input accessibilityLabel="Email" onChangeText={onChangeText} />);

		await user.type(field("Email"), "ada");

		expect(onChangeText).toHaveBeenLastCalledWith("ada");
		expect(field("Email")).toHaveDisplayValue("ada");
	});

	test("controlled: shows value, and only asks the owner to change it", async () => {
		const user = userEvent.setup();
		const onChangeText = jest.fn();
		await render(<Input accessibilityLabel="Code" value="42" onChangeText={onChangeText} />);

		await user.type(field("Code"), "7");

		expect(onChangeText).toHaveBeenCalledWith("427");
		expect(field("Code")).toHaveDisplayValue("42");
	});

	test("disabled: not editable, and announced disabled", async () => {
		await render(<Input accessibilityLabel="Email" disabled />);

		expect(field("Email")).not.toBeEnabled();
		expect(field("Email")).toHaveProp("editable", false);
	});

	test("reports focus and blur to the caller", async () => {
		const user = userEvent.setup();
		const onFocus = jest.fn();
		const onBlur = jest.fn();
		await render(<Input accessibilityLabel="Email" onFocus={onFocus} onBlur={onBlur} />);

		await user.type(field("Email"), "a");

		expect(onFocus).toHaveBeenCalledTimes(1);
		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	test("a tap on the prefix or the padding focuses the text field", async () => {
		const user = userEvent.setup();
		const ref = createRef<TextInput>();
		await render(<Input ref={ref} accessibilityLabel="Price" prefix="€" suffix="EUR" />);

		await user.press(screen.getByText("€"));

		expect(ref.current?.focus).toHaveBeenCalled();
		expect(screen.getByText("EUR")).toBeOnTheScreen();
	});

	test("a tap around a disabled field doesn't focus it", async () => {
		const user = userEvent.setup();
		const ref = createRef<TextInput>();
		await render(<Input ref={ref} accessibilityLabel="Price" prefix="€" disabled />);

		await user.press(screen.getByText("€"));

		expect(ref.current?.focus).not.toHaveBeenCalled();
	});

	test("forwards the TextInput props", async () => {
		await render(
			<Input accessibilityLabel="Password" secureTextEntry autoComplete="password" placeholder="••••" />,
		);

		expect(field("Password")).toHaveProp("secureTextEntry", true);
		expect(screen.getByPlaceholderText("••••")).toBeOnTheScreen();
	});
});

describe("Field", () => {
	function Email(props: { error?: string; required?: boolean; disabled?: boolean; hint?: string }) {
		return (
			<Field required={props.required} disabled={props.disabled}>
				<Field.Label>Email</Field.Label>
				<Input accessibilityHint={props.hint} />
				<Field.Description>We never share it.</Field.Description>
				{props.error ? <Field.Error>{props.error}</Field.Error> : null}
			</Field>
		);
	}

	test("the label names the input, and is read once, with it", async () => {
		await render(<Email />);

		expect(field("Email")).toBeOnTheScreen();
		// The visible label is hidden from screen readers: the field announces it.
		expect(screen.queryByText("Email")).toBeNull();
	});

	test("the description becomes the field's hint", async () => {
		await render(<Email />);

		expect(field("Email")).toHaveProp("accessibilityHint", "We never share it.");
		expect(screen.queryByText("We never share it.")).toBeNull();
	});

	test("an error replaces the description in the hint", async () => {
		await render(<Email error="Enter a valid email." />);

		expect(field("Email")).toHaveProp("accessibilityHint", "Enter a valid email.");
	});

	test("the error leaves with its element: the description comes back", async () => {
		const view = await render(<Email error="Enter a valid email." />);

		await view.rerender(<Email />);

		expect(field("Email")).toHaveProp("accessibilityHint", "We never share it.");
	});

	test("required is announced first, and marks the label", async () => {
		await render(<Email required hint="Used to sign in" />);

		// Required first, then the description, then the caller's own hint.
		expect(field("Email").props.accessibilityHint).toMatch(/^Required\. We never share it\..* Used to sign in$/);
		expect(screen.getByText("*", { includeHiddenElements: true })).toBeOnTheScreen();
	});

	test("a disabled field disables its input", async () => {
		await render(<Email disabled />);

		expect(field("Email")).toHaveProp("editable", false);
	});

	test("the input's own label and disabled state win over the field's", async () => {
		await render(
			<Field disabled>
				<Field.Label>Email</Field.Label>
				<Input accessibilityLabel="Work email" disabled={false} />
			</Field>,
		);

		expect(field("Work email")).toHaveProp("editable", true);
	});
});
