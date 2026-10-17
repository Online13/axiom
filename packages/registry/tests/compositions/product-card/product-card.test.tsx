import { Text } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";

import { ProductCard } from "@/components/compositions/product-card";

jest.useFakeTimers();

const PRODUCT = { title: "Linen shirt", price: "$48.00", subtitle: "Sand", badge: "New", media: <Text>photo</Text> };

describe("ProductCard", () => {
	test("shows the title, price, subtitle, badge and media", async () => {
		await render(<ProductCard {...PRODUCT} />);

		for (const text of ["Linen shirt", "$48.00", "Sand", "New", "photo"]) expect(screen.getByText(text)).toBeOnTheScreen();
	});

	test("pressable, it is one button read as title and price", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<ProductCard {...PRODUCT} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Linen shirt, $48.00" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("the action keeps its own press", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		const onAction = jest.fn();
		await render(<ProductCard {...PRODUCT} actionLabel="Add to bag" onAction={onAction} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Add to bag" }));

		expect(onAction).toHaveBeenCalledTimes(1);
		expect(onPress).not.toHaveBeenCalled();
	});

	test("without handlers it has no button", async () => {
		await render(<ProductCard {...PRODUCT} />);

		expect(screen.queryByRole("button")).toBeNull();
	});
});
