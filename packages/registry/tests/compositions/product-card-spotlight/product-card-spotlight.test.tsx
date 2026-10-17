import { Text } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";

import { ProductCardSpotlight } from "@/components/compositions/product-card-spotlight";

jest.useFakeTimers();

const PRODUCT = { title: "Linen shirt", price: "$48.00", subtitle: "Sand", badge: "New", media: <Text>photo</Text> };

describe("ProductCardSpotlight", () => {
	test("shows the title, price, subtitle, badge and media", async () => {
		await render(<ProductCardSpotlight {...PRODUCT} />);

		for (const text of ["Linen shirt", "$48.00", "Sand", "New", "photo"]) expect(screen.getByText(text)).toBeOnTheScreen();
	});

	test("pressable, it is one button read as title and price", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<ProductCardSpotlight {...PRODUCT} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Linen shirt, $48.00" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("the action keeps its own press", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		const onAction = jest.fn();
		await render(<ProductCardSpotlight {...PRODUCT} actionLabel="Add to bag" onAction={onAction} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Add to bag" }));

		expect(onAction).toHaveBeenCalledTimes(1);
		expect(onPress).not.toHaveBeenCalled();
	});

	test("without handlers it has no button", async () => {
		await render(<ProductCardSpotlight {...PRODUCT} />);

		expect(screen.queryByRole("button")).toBeNull();
	});
});
