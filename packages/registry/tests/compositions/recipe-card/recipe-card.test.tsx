import { render, screen, userEvent } from "@testing-library/react-native";

import { RecipeCard } from "@/components/compositions/recipe-card";

jest.useFakeTimers();

const RECIPE = {
	title: "Green curry",
	description: "Ready in 20 minutes.",
	image: { uri: "https://example.com/curry.jpg" },
	badge: "Spicy",
	stats: [{ icon: "time" as const, value: "20", label: "mins" }],
};

describe("RecipeCard", () => {
	test("shows the title, description, badge and stats", async () => {
		await render(<RecipeCard {...RECIPE} />);

		for (const text of ["Green curry", "Ready in 20 minutes.", "Spicy"]) expect(screen.getByText(text)).toBeOnTheScreen();
		expect(screen.getByText(/^20\s*mins$/)).toBeOnTheScreen();
	});

	test("shows two ingredients and counts the rest, read in words", async () => {
		await render(<RecipeCard {...RECIPE} ingredients={["Coconut milk", "Basil", "Tofu", "Lime"]} />);

		expect(screen.getByLabelText("Coconut milk")).toBeOnTheScreen();
		expect(screen.getByLabelText("Basil")).toBeOnTheScreen();
		expect(screen.queryByLabelText("Tofu")).toBeNull();
		expect(screen.getByLabelText("2 more ingredients")).toHaveTextContent("+2");
	});

	test("no '+n' chip when every ingredient is shown", async () => {
		await render(<RecipeCard {...RECIPE} ingredients={["Rice", "Egg"]} />);

		expect(screen.queryByLabelText(/more ingredients/)).toBeNull();
	});

	test("pressable, it is a button named by the title; the action keeps its own press", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		const onAction = jest.fn();
		await render(<RecipeCard {...RECIPE} actionLabel="Cook now" onAction={onAction} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Cook now" }));
		expect(onAction).toHaveBeenCalledTimes(1);
		expect(onPress).not.toHaveBeenCalled();

		await user.press(screen.getByRole("button", { name: "Green curry" }));
		expect(onPress).toHaveBeenCalledTimes(1);
	});
});
