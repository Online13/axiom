import { Text } from "react-native";
import { render, screen, userEvent, fireEvent } from "@testing-library/react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

jest.useFakeTimers();

describe("Card", () => {
	test("without onPress, it is a plain container", async () => {
		await render(
			<Card testID="card">
				<Card.Header>
					<Card.Title>Plan</Card.Title>
					<Card.Description>Billed monthly</Card.Description>
				</Card.Header>
			</Card>,
		);

		expect(screen.queryByRole("button")).toBeNull();
		expect(screen.getByTestId("card")).toHaveTextContent("PlanBilled monthly");
	});

	test("the title is a header", async () => {
		await render(
			<Card>
				<Card.Header>
					<Card.Title>Plan</Card.Title>
				</Card.Header>
			</Card>,
		);

		expect(screen.getByRole("header", { name: "Plan" })).toBeOnTheScreen();
	});

	test("with onPress, the whole card is a button", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(
			<Card onPress={onPress} accessibilityLabel="Open article">
				<Card.Content>
					<Text>Body</Text>
				</Card.Content>
			</Card>,
		);

		await user.press(screen.getByRole("button", { name: "Open article" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("a button inside a pressable card gets its own press, not the card's", async () => {
		const user = userEvent.setup();
		const onCard = jest.fn();
		const onShare = jest.fn();
		await render(
			<Card onPress={onCard} accessibilityLabel="Article">
				<Card.Footer>
					<Button onPress={onShare}>Share</Button>
				</Card.Footer>
			</Card>,
		);

		await user.press(screen.getByText("Share"));

		expect(onShare).toHaveBeenCalledTimes(1);
		expect(onCard).not.toHaveBeenCalled();
	});

	test("a disabled pressable card ignores presses", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<Card onPress={onPress} disabled accessibilityLabel="Archived" />);

		const card = screen.getByRole("button", { name: "Archived" });
		await user.press(card);

		expect(onPress).not.toHaveBeenCalled();
		expect(card).toBeDisabled();
	});

	test("Card.Media shows the image and lays children over it", async () => {
		await render(
			<Card.Media source={{ uri: "https://example.com/cover.jpg" }} testID="media" aspectRatio={2}>
				<Text>New</Text>
			</Card.Media>,
		);

		const media = screen.getByTestId("media");
		expect(media).toHaveStyle({ aspectRatio: 2 });
		expect(media).toHaveTextContent("New");
		const image = screen.container.queryAll((node) => node.type === "Image")[0];
		await fireEvent(image, "load");
		expect(image).toHaveProp("source", { uri: "https://example.com/cover.jpg" });
	});
});
