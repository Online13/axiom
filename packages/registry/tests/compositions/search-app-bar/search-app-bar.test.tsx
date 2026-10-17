import { createRef } from "react";
import type { TextInput } from "react-native";
import { fireEvent, render, screen, userEvent } from "@testing-library/react-native";

import { SearchAppBar } from "@/components/compositions/search-app-bar";
import { IconButton } from "@/components/ui/icon-button";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

const field = () => screen.getByRole("search", { name: "Search" });

describe("SearchAppBar", () => {
	test("a back button when there is somewhere to go back to", async () => {
		const user = userEvent.setup();
		const onNavigate = jest.fn();
		const view = await render(<SearchAppBar />);
		expect(screen.queryByRole("button", { name: "Back" })).toBeNull();

		await view.rerender(<SearchAppBar onNavigate={onNavigate} />);
		await user.press(screen.getByRole("button", { name: "Back" }));
		expect(onNavigate).toHaveBeenCalledTimes(1);

		await view.rerender(<SearchAppBar onNavigate={onNavigate} navigation="close" />);
		expect(screen.getByRole("button", { name: "Close" })).toBeOnTheScreen();
	});

	test("Cancel only works while the field has focus; it blurs the field and cancels", async () => {
		const user = userEvent.setup();
		const onCancel = jest.fn();
		const ref = createRef<TextInput>();
		await render(<SearchAppBar ref={ref} onCancel={onCancel} />);

		expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();

		await fireEvent(field(), "focus");
		const cancel = screen.getByRole("button", { name: "Cancel" });
		expect(cancel).toBeEnabled();
		await user.press(cancel);

		expect(onCancel).toHaveBeenCalledTimes(1);
		expect(ref.current?.blur).toHaveBeenCalled();
	});

	test("forwards the search props and the focus events", async () => {
		const onChangeText = jest.fn();
		const onFocus = jest.fn();
		await render(<SearchAppBar placeholder="Search songs" onChangeText={onChangeText} onFocus={onFocus} />);
		const input = screen.getByRole("search", { name: "Search songs" });

		await fireEvent(input, "focus");
		await fireEvent.changeText(input, "blue");

		expect(onFocus).toHaveBeenCalledTimes(1);
		expect(onChangeText).toHaveBeenCalledWith("blue");
	});

	test("renders its actions after the field", async () => {
		await render(
			<SearchAppBar>
				<IconButton icon="filter" accessibilityLabel="Filters" />
			</SearchAppBar>,
		);

		expect(screen.getByRole("button", { name: "Filters" })).toBeOnTheScreen();
	});
});
