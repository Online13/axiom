import { createRef } from "react";
import type { TextInput } from "react-native";
import { fireEvent, render, screen, userEvent } from "@testing-library/react-native";

import { SearchBar } from "@/components/ui/search-bar";
import { Text } from "@/components/ui/text";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

const search = () => screen.getByRole("search", { name: "Search" });

describe("SearchBar", () => {
	test("is a search field named by its placeholder, with the search key", async () => {
		await render(<SearchBar />);

		expect(search()).toHaveProp("returnKeyType", "search");
		expect(search()).toHaveProp("placeholder", "Search");
	});

	test("typing shows a 'Clear search' button that empties and refocuses the field", async () => {
		const user = userEvent.setup();
		const ref = createRef<TextInput>();
		const onChangeText = jest.fn();
		await render(<SearchBar ref={ref} onChangeText={onChangeText} />);
		expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();

		await user.type(search(), "pizza");
		jest.mocked(ref.current!.focus).mockClear();
		await user.press(screen.getByRole("button", { name: "Clear search" }));

		expect(search()).toHaveDisplayValue("");
		expect(onChangeText).toHaveBeenLastCalledWith("");
		expect(ref.current?.focus).toHaveBeenCalled();
		expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
	});

	test("clearable={false} never shows the clear button", async () => {
		await render(<SearchBar clearable={false} defaultValue="pizza" />);

		expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
	});

	test("the search key submits the query", async () => {
		const onSubmit = jest.fn();
		await render(<SearchBar onSubmit={onSubmit} />);

		await fireEvent(search(), "submitEditing", { nativeEvent: { text: "pizza" } });

		expect(onSubmit).toHaveBeenCalledWith("pizza");
	});

	test("the trailing content shows only while the field is empty", async () => {
		const user = userEvent.setup();
		await render(<SearchBar trailing={<Text>Mic</Text>} />);
		expect(screen.getByText("Mic")).toBeOnTheScreen();

		await user.type(search(), "a");

		expect(screen.queryByText("Mic")).toBeNull();
	});

	test("loading replaces the icon with a 'Searching' progressbar", async () => {
		await render(<SearchBar loading />);

		expect(screen.getByRole("progressbar", { name: "Searching" })).toBeOnTheScreen();
	});

	test("disabled: not editable, and the clear button doesn't clear", async () => {
		const user = userEvent.setup();
		const onChangeText = jest.fn();
		await render(<SearchBar disabled defaultValue="pizza" onChangeText={onChangeText} />);

		expect(search()).toHaveProp("editable", false);
		await user.press(screen.getByRole("button", { name: "Clear search" }));

		expect(onChangeText).not.toHaveBeenCalled();
	});

	test("controlled: the field shows value", async () => {
		const view = await render(<SearchBar value="tea" />);
		expect(search()).toHaveDisplayValue("tea");

		await view.rerender(<SearchBar value="" />);
		expect(search()).toHaveDisplayValue("");
	});
});
