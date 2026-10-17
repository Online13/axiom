import { fireEvent, render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { InputOTP } from "@/components/ui/input-otp";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

const code = (name = "Verification code") => screen.getByLabelText(name);
/** What the cells draw. They're hidden from screen readers: the field announces the code. */
const cells = () => screen.getAllByText(/^.$/, { includeHiddenElements: true }).map((cell) => cell.props.children);

describe("InputOTP", () => {
	test("one field named 'Verification code', set up for the SMS code autofill", async () => {
		await render(<InputOTP />);

		const field = code();
		expect(field).toHaveProp("textContentType", "oneTimeCode");
		expect(field).toHaveProp("keyboardType", "number-pad");
		expect(field).toHaveProp("maxLength", 6);
		expect(field).toHaveProp("autoFocus", true);
	});

	test("each digit typed fills the next cell", async () => {
		const user = userEvent.setup();
		const onChange = jest.fn();
		await render(<InputOTP onChange={onChange} />);

		await user.type(code(), "381");

		expect(cells()).toEqual(["3", "8", "1"]);
		expect(onChange).toHaveBeenLastCalledWith("381");
	});

	test("numeric drops anything that isn't a digit, and a paste is cut to the length", async () => {
		const onChange = jest.fn();
		await render(<InputOTP length={4} onChange={onChange} />);

		await fireEvent.changeText(code(), "12-34-56");

		expect(onChange).toHaveBeenLastCalledWith("1234");
	});

	test("alphanumeric keeps letters and drops symbols", async () => {
		const onChange = jest.fn();
		await render(<InputOTP type="alphanumeric" onChange={onChange} />);

		await fireEvent.changeText(code(), "ab-C1!");

		expect(onChange).toHaveBeenLastCalledWith("abC1");
		expect(code()).toHaveProp("keyboardType", "default");
	});

	test("onComplete runs once every cell is filled, with the code", async () => {
		const user = userEvent.setup();
		const onComplete = jest.fn();
		await render(<InputOTP length={4} onComplete={onComplete} />);

		await user.type(code(), "123");
		expect(onComplete).not.toHaveBeenCalled();

		await user.type(code(), "4");
		expect(onComplete).toHaveBeenCalledWith("1234");
		expect(onComplete).toHaveBeenCalledTimes(1);
	});

	test("an autofilled code completes in one go", async () => {
		const onComplete = jest.fn();
		await render(<InputOTP onComplete={onComplete} />);

		await fireEvent.changeText(code(), "482913");

		expect(onComplete).toHaveBeenCalledWith("482913");
	});

	test("a change that filters to the same code is ignored", async () => {
		const onChange = jest.fn();
		await render(<InputOTP defaultValue="12" onChange={onChange} />);

		await fireEvent.changeText(code(), "12x");

		expect(onChange).not.toHaveBeenCalled();
	});

	test("screen readers hear the code, or only how many characters are in when secure", async () => {
		const view = await render(<InputOTP defaultValue="123" />);
		expect(code()).toHaveAccessibilityValue({ text: "123" });

		await view.rerender(<InputOTP defaultValue="123" secure />);
		expect(code()).toHaveAccessibilityValue({ text: "3 of 6" });
	});

	test("secure shows dots instead of the characters", async () => {
		await render(<InputOTP defaultValue="123" secure />);

		expect(screen.queryAllByText(/^\d$/, { includeHiddenElements: true })).toHaveLength(0);
	});

	test("an error plays the error haptic once, when it turns on", async () => {
		const view = await render(<InputOTP />);
		expect(Haptics.notificationAsync).not.toHaveBeenCalled();

		await view.rerender(<InputOTP error />);
		await view.rerender(<InputOTP error defaultValue="1" />);

		expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);
		expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Error);
	});

	test("haptic={false} keeps errors silent", async () => {
		await render(<InputOTP error haptic={false} />);

		expect(Haptics.notificationAsync).not.toHaveBeenCalled();
	});

	test("disabled: not editable and never focused on mount", async () => {
		await render(<InputOTP disabled />);

		expect(code()).toHaveProp("editable", false);
		expect(code()).toHaveProp("autoFocus", false);
	});

	test("controlled: the cells draw value", async () => {
		const view = await render(<InputOTP value="12" />);
		expect(cells()).toEqual(["1", "2"]);

		await view.rerender(<InputOTP value="" />);
		expect(screen.queryAllByText(/^.$/, { includeHiddenElements: true })).toHaveLength(0);
	});
});
