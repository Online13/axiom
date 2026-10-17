import { render, screen, userEvent } from "@testing-library/react-native";

import { SearchResultItem, splitMatch } from "@/components/compositions/search-result-item";

jest.useFakeTimers();

describe("SearchResultItem", () => {
	test("is read as title, subtitle and meta", async () => {
		await render(<SearchResultItem title="Blue Monday" subtitle="New Order" meta="Song · 1983" onPress={() => {}} />);

		expect(screen.getByRole("button", { name: "Blue Monday, New Order, Song · 1983" })).toBeOnTheScreen();
	});

	test("draws the part of the title matching the query on its own, case-insensitively", async () => {
		await render(<SearchResultItem title="Blue Monday" query="mon" />);

		expect(screen.getByText("Mon")).toBeOnTheScreen();
		expect(screen.getByText(/^Blue .*day$/)).toBeOnTheScreen();
	});

	test("the action names the result and keeps its own press", async () => {
		const user = userEvent.setup();
		const onAdd = jest.fn();
		const onPress = jest.fn();
		await render(
			<SearchResultItem title="Blue Monday" onPress={onPress} action={{ icon: "add", label: "Add", onPress: onAdd }} />,
		);

		await user.press(screen.getByRole("button", { name: "Add, Blue Monday" }));

		expect(onAdd).toHaveBeenCalledTimes(1);
		expect(onPress).not.toHaveBeenCalled();
	});

	test("disabled: ignores presses", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<SearchResultItem title="Offline" onPress={onPress} disabled />);

		await user.press(screen.getByRole("button", { name: "Offline" }));

		expect(onPress).not.toHaveBeenCalled();
	});
});

describe("splitMatch", () => {
	test("splits around the first case-insensitive match", () => {
		expect(splitMatch("Blue Monday", "MON")).toEqual({ before: "Blue ", match: "Mon", after: "day" });
		expect(splitMatch("aaa", "a")).toEqual({ before: "", match: "a", after: "aa" });
	});

	test("trims the query, and returns null without a match or a query", () => {
		expect(splitMatch("Blue Monday", "  blue ")).toEqual({ before: "", match: "Blue", after: " Monday" });
		expect(splitMatch("Blue Monday", "jazz")).toBeNull();
		expect(splitMatch("Blue Monday", "   ")).toBeNull();
		expect(splitMatch("Blue Monday")).toBeNull();
	});
});
