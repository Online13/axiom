import { render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { Passcode } from "@/components/ui/passcode";

import { advance } from "../../utils/time";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

const key = (name: string) => screen.getByRole("button", { name });
const slots = () => screen.getByLabelText("Passcode");

async function typeCode(digits: string) {
	const user = userEvent.setup();
	for (const digit of digits) await user.press(key(digit));
}

describe("Passcode", () => {
	test("renders the slots and a keypad of ten digits and delete", async () => {
		await render(<Passcode />);

		for (const digit of "0123456789") expect(key(digit)).toBeOnTheScreen();
		expect(key("Delete")).toBeOnTheScreen();
		expect(slots()).toHaveAccessibilityValue({ text: "0 of 4 digits entered" });
	});

	test("the slots announce how many digits are in, never which ones", async () => {
		const onChange = jest.fn();
		await render(<Passcode onChange={onChange} />);

		await typeCode("27");

		expect(onChange).toHaveBeenLastCalledWith("27");
		expect(slots()).toHaveAccessibilityValue({ text: "2 of 4 digits entered" });
		expect(slots()).not.toHaveTextContent("27");
	});

	describe("delete", () => {
		test("is disabled while the code is empty", async () => {
			await render(<Passcode />);

			expect(key("Delete")).toBeDisabled();
		});

		test("removes the last digit; a long press clears the code", async () => {
			const user = userEvent.setup();
			const onChange = jest.fn();
			await render(<Passcode onChange={onChange} length={6} />);

			await typeCode("123");
			await user.press(key("Delete"));
			expect(onChange).toHaveBeenLastCalledWith("12");

			await user.longPress(key("Delete"), { duration: 600 });
			expect(onChange).toHaveBeenLastCalledWith("");
		});
	});

	test("the last digit runs onComplete with the code; more digits are ignored", async () => {
		const onComplete = jest.fn();
		const onChange = jest.fn();
		await render(<Passcode onComplete={onComplete} onChange={onChange} />);

		await typeCode("40719");

		expect(onComplete).toHaveBeenCalledWith("4071");
		expect(onComplete).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenLastCalledWith("4071");
	});

	describe("verification", () => {
		test("onComplete returning false: error haptic, keys locked, then the code clears", async () => {
			const onChange = jest.fn();
			await render(<Passcode onComplete={() => false} onChange={onChange} />);

			await typeCode("1111");

			expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Error);
			expect(key("5")).toBeDisabled();

			await advance(550);
			expect(onChange).toHaveBeenLastCalledWith("");
			expect(key("5")).toBeEnabled();
			expect(slots()).toHaveAccessibilityValue({ text: "0 of 4 digits entered" });
		});

		test("a promise locks the keypad while it verifies", async () => {
			let resolve!: (ok: boolean) => void;
			const onComplete = () => new Promise<boolean>((r) => (resolve = r));
			await render(<Passcode onComplete={onComplete} />);

			await typeCode("1234");
			expect(key("5")).toBeDisabled();
			expect(key("Delete")).toBeDisabled();

			await advance(0);
			resolve(true);
			await advance(0);

			expect(Haptics.notificationAsync).not.toHaveBeenCalled();
			expect(slots()).toHaveAccessibilityValue({ text: "4 of 4 digits entered" });
		});

		test("a promise of false fails like false", async () => {
			const onChange = jest.fn();
			await render(<Passcode onComplete={() => Promise.resolve(false)} onChange={onChange} />);

			await typeCode("9999");
			await advance(0);
			expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);

			await advance(550);
			expect(onChange).toHaveBeenLastCalledWith("");
		});

		test("a screen that verifies itself drives the status", async () => {
			const view = await render(<Passcode status="verifying" defaultValue="12" />);
			expect(key("3")).toBeDisabled();

			await view.rerender(<Passcode status="error" defaultValue="12" />);
			expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);

			await view.rerender(<Passcode status="idle" defaultValue="12" />);
			expect(key("3")).toBeEnabled();
		});
	});

	test("disabled: every key is", async () => {
		await render(<Passcode disabled />);

		expect(key("1")).toBeDisabled();
		expect(key("0")).toBeDisabled();
	});

	test("not secure, the box slots show the digits", async () => {
		await render(
			<Passcode secure={false}>
				<Passcode.Group variant="box" />
				<Passcode.Keyboard />
			</Passcode>,
		);

		await typeCode("58");

		expect(slots()).toHaveTextContent("58");
	});

	test("a custom keyboard with a biometrics key", async () => {
		const user = userEvent.setup();
		const onBiometrics = jest.fn();
		await render(
			<Passcode>
				<Passcode.Group />
				<Passcode.Keyboard letters={false}>
					<Passcode.Key value="1" />
					<Passcode.KeyAction action="biometrics" onPress={onBiometrics} />
				</Passcode.Keyboard>
			</Passcode>,
		);

		await user.press(key("Unlock with biometrics"));

		expect(onBiometrics).toHaveBeenCalledTimes(1);
		expect(screen.queryByText("ABC")).toBeNull();
	});

	test("parts outside a Passcode throw a clear error", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});

		await expect(render(<Passcode.Group />)).rejects.toThrow("Passcode parts must be used inside <Passcode>.");
	});
});
