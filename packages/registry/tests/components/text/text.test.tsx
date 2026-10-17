import { Pressable } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";

import { MAX_FONT_SCALE, Text } from "@/components/ui/text";

jest.useFakeTimers();

describe("Text", () => {
	test("renders its children and forwards the native Text props", async () => {
		await render(
			<Text numberOfLines={2} testID="copy" accessibilityRole="text">
				Hello
			</Text>,
		);

		const text = screen.getByTestId("copy");
		expect(text).toHaveTextContent("Hello");
		expect(text).toHaveProp("numberOfLines", 2);
	});

	test("a nested Text keeps the paragraph's text: one run, read as one sentence", async () => {
		await render(
			<Text testID="paragraph">
				By continuing you accept the <Text weight="semibold">terms</Text>.
			</Text>,
		);

		expect(screen.getByTestId("paragraph")).toHaveTextContent("By continuing you accept the terms.");
	});

	test("asChild puts the text styles on its child, which keeps its role and press", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(
			<Text asChild color="link">
				<Pressable accessibilityRole="link" onPress={onPress}>
					<Text>Privacy</Text>
				</Pressable>
			</Text>,
		);

		await user.press(screen.getByRole("link", { name: "Privacy" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("exposes the font scale caps components use", () => {
		expect(MAX_FONT_SCALE.control).toBeGreaterThan(MAX_FONT_SCALE.fixed);
		expect(MAX_FONT_SCALE.fixed).toBeGreaterThanOrEqual(1);
	});
});
