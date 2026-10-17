import { createRef } from "react";
import { Dimensions, type TextInput } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";

import { Field } from "@/components/ui/input";
import { TextArea } from "@/components/ui/text-area";
import { MAX_FONT_SCALE } from "@/components/ui/text";
import { spacing, typography } from "@/theme/tokens";

import { styling } from "../../utils/styling";

jest.useFakeTimers();

const area = (name: string) => screen.getByLabelText(name);

describe("TextArea", () => {
	test("is always multiline, and reports what is typed", async () => {
		const user = userEvent.setup();
		const onChangeText = jest.fn();
		await render(<TextArea accessibilityLabel="Message" onChangeText={onChangeText} />);

		await user.type(area("Message"), "Hi");

		expect(area("Message")).toHaveProp("multiline", true);
		expect(onChangeText).toHaveBeenLastCalledWith("Hi");
	});

	test("inside a Field, takes its label and error", async () => {
		await render(
			<Field>
				<Field.Label>Bio</Field.Label>
				<TextArea />
				<Field.Error>Too long.</Field.Error>
			</Field>,
		);

		expect(area("Bio")).toHaveProp("accessibilityHint", "Too long.");
	});

	test("disabled: not editable", async () => {
		await render(<TextArea accessibilityLabel="Notes" disabled />);

		expect(area("Notes")).toHaveProp("editable", false);
	});

	test("a tap on the padding focuses it", async () => {
		const user = userEvent.setup();
		const ref = createRef<TextInput>();
		await render(<TextArea ref={ref} accessibilityLabel="Notes" testID="notes" />);

		await user.press(screen.getByTestId("notes").parent!);

		expect(ref.current?.focus).toHaveBeenCalled();
	});

	describe("height", () => {
		// Jest's window reports a font scale of 2: the rows follow it, up to the cap of controls.
		// Unistyles reads the scale from its runtime, which its Jest mock fixes at 1.
		const fontScale = styling === "unistyles" ? 1 : Dimensions.get("window").fontScale;
		const scale = Math.min(fontScale, MAX_FONT_SCALE.control);
		const line = typography.callout.lineHeight * scale;
		const padding = (spacing[3] - 1) * 2;

		test("without autoGrow, the height is minRows lines, at the capped font scale", async () => {
			await render(<TextArea accessibilityLabel="Notes" minRows={3} />);

			expect(area("Notes")).toHaveStyle({ height: 3 * line + padding });
		});

		test("autoGrow grows between minRows and maxRows", async () => {
			await render(<TextArea accessibilityLabel="Notes" autoGrow minRows={2} maxRows={5} />);

			expect(area("Notes")).toHaveStyle({
				minHeight: 2 * line + padding,
				maxHeight: 5 * line + padding,
			});
		});

		test("plain has no fixed height: it fills its parent, for a full-screen editor", async () => {
			await render(<TextArea accessibilityLabel="Notes" variant="plain" minRows={4} />);

			expect(area("Notes")).not.toHaveStyle({ height: 4 * typography.callout.lineHeight * scale });
		});
	});
});
