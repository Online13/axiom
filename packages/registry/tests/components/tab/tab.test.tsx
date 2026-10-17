import { createRef } from "react";
import { ScrollView, Text } from "react-native";
import { fireEvent, render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { Tab, type TabProps } from "@/components/ui/tab";

import { layout } from "../../utils/events";

jest.useFakeTimers();

beforeEach(() => jest.clearAllMocks());

function Library(props: Partial<TabProps> & { onBooksPress?: () => void }) {
	const { onBooksPress, ...tab } = props;
	return (
		<Tab defaultValue="books" {...tab}>
			<Tab.List>
				<Tab.Item value="books" onPress={onBooksPress}>
					Books
				</Tab.Item>
				<Tab.Item value="music" badge={4}>
					Music
				</Tab.Item>
				<Tab.Item value="films" disabled>
					Films
				</Tab.Item>
			</Tab.List>
			<Tab.Content>
				<Tab.Panel value="books">
					<Text>Book list</Text>
				</Tab.Panel>
				<Tab.Panel value="music">
					<Text>Album list</Text>
				</Tab.Panel>
				<Tab.Panel value="films">
					<Text>Film list</Text>
				</Tab.Panel>
			</Tab.Content>
		</Tab>
	);
}

const tab = (name: string) => screen.getByRole("tab", { name: new RegExp(`^${name}`) });

describe("Tab", () => {
	test("a tablist of tabs; only the selected panel is rendered", async () => {
		await render(<Library />);

		expect(screen.getAllByRole("tab")).toHaveLength(3);
		expect(tab("Books")).toBeSelected();
		expect(screen.getByText("Book list")).toBeOnTheScreen();
		expect(screen.queryByText("Album list", { includeHiddenElements: true })).toBeNull();
	});

	test("pressing a tab shows its panel and reports it", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(<Library onValueChange={onValueChange} />);

		await user.press(tab("Music"));

		expect(tab("Music")).toBeSelected();
		expect(tab("Books")).not.toBeSelected();
		expect(screen.getByText("Album list")).toBeOnTheScreen();
		expect(screen.queryByText("Book list")).toBeNull();
		expect(onValueChange).toHaveBeenCalledWith("music");
	});

	test("the item's own onPress still runs", async () => {
		const user = userEvent.setup();
		const onBooksPress = jest.fn();
		await render(<Library onBooksPress={onBooksPress} defaultValue="music" />);

		await user.press(tab("Books"));

		expect(onBooksPress).toHaveBeenCalledTimes(1);
		expect(tab("Books")).toBeSelected();
	});

	test("a disabled tab can't be selected", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(<Library onValueChange={onValueChange} />);

		await user.press(tab("Films"));

		expect(tab("Films")).toBeDisabled();
		expect(onValueChange).not.toHaveBeenCalled();
	});

	test("controlled: the selected tab follows value", async () => {
		const user = userEvent.setup();
		const view = await render(<Library value="books" />);

		await user.press(tab("Music"));
		expect(screen.getByText("Book list")).toBeOnTheScreen();

		await view.rerender(<Library value="music" />);
		expect(screen.getByText("Album list")).toBeOnTheScreen();
	});

	test("plays its haptic only on a change, and only when asked", async () => {
		const user = userEvent.setup();
		const view = await render(<Library />);
		await user.press(tab("Music"));
		expect(Haptics.selectionAsync).not.toHaveBeenCalled();

		await view.rerender(<Library haptic="selection" />);
		await user.press(tab("Music"));
		expect(Haptics.selectionAsync).not.toHaveBeenCalled();
		await user.press(tab("Books"));
		expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
	});

	test("shows an item's badge", async () => {
		await render(<Library />);

		expect(tab("Music")).toHaveTextContent("Music4");
	});

	test("a scrollable list scrolls to keep the selected tab in the middle", async () => {
		const user = userEvent.setup();
		const list = createRef<ScrollView>();
		await render(
			<Tab defaultValue="a">
				<Tab.List scrollable ref={list} testID="list">
					{["a", "b", "c", "d", "e", "f"].map((value) => (
						<Tab.Item key={value} value={value}>
							{value.toUpperCase()}
						</Tab.Item>
					))}
				</Tab.List>
			</Tab>,
		);
		const scrollTo = jest.spyOn(list.current!, "scrollTo");
		// A 200pt viewport over 600pt of tabs, 100pt each.
		await layout(screen.getByTestId("list"), { width: 200, height: 44 });
		await fireEvent(screen.getByTestId("list"), "contentSizeChange", 600, 44);
		for (const [i, name] of ["A", "B", "C", "D", "E", "F"].entries()) {
			await layout(tab(name), { x: i * 100, width: 100, height: 44 });
		}

		await user.press(tab("D"));
		expect(scrollTo).toHaveBeenLastCalledWith({ x: 250, animated: true });

		await user.press(tab("F"));
		expect(scrollTo).toHaveBeenLastCalledWith({ x: 400, animated: true });

		await user.press(tab("A"));
		expect(scrollTo).toHaveBeenLastCalledWith({ x: 0, animated: true });
	});

	describe("Tab.Pager", () => {
		function Pager({ onValueChange }: { onValueChange?: (value: string) => void }) {
			return (
				<Tab defaultValue="books" onValueChange={onValueChange}>
					<Tab.List>
						<Tab.Item value="books">Books</Tab.Item>
						<Tab.Item value="music">Music</Tab.Item>
					</Tab.List>
					<Tab.Pager testID="pager">
						<Tab.Panel value="books" testID="books">
							<Text>Book list</Text>
						</Tab.Panel>
						<Tab.Panel value="music" testID="music">
							<Text>Album list</Text>
						</Tab.Panel>
					</Tab.Pager>
				</Tab>
			);
		}

		test("renders every page, and hides the others from screen readers", async () => {
			await render(<Pager />);

			expect(screen.getByText("Book list")).toBeOnTheScreen();
			expect(screen.queryByText("Album list")).toBeNull();
			expect(screen.getByText("Album list", { includeHiddenElements: true })).toBeOnTheScreen();
		});

		test("swiping to a page selects its tab", async () => {
			const onValueChange = jest.fn();
			await render(<Pager onValueChange={onValueChange} />);
			await layout(screen.getByTestId("books", { includeHiddenElements: true }), { x: 0, width: 390, height: 600 });
			await layout(screen.getByTestId("music", { includeHiddenElements: true }), { x: 390, width: 390, height: 600 });

			await fireEvent(screen.getByTestId("pager"), "momentumScrollEnd", {
				nativeEvent: { contentOffset: { x: 380, y: 0 } },
			});

			expect(onValueChange).toHaveBeenCalledWith("music");
			expect(tab("Music")).toBeSelected();
			expect(screen.getByText("Album list")).toBeOnTheScreen();
		});

		test("pages take the pager's width", async () => {
			await render(<Pager />);

			await layout(screen.getByTestId("pager"), { width: 390, height: 600 });

			expect(screen.getByTestId("books")).toHaveStyle({ width: 390 });
		});
	});

	test("parts used outside their parent throw a clear error", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});

		await expect(render(<Tab.List />)).rejects.toThrow("Tab components must be used inside <Tab>.");
		await expect(
			render(
				<Tab>
					<Tab.Item value="a">A</Tab.Item>
				</Tab>,
			),
		).rejects.toThrow("Tab.Item must be used inside <Tab.List>.");
		await expect(
			render(
				<Tab>
					<Tab.Panel value="a" />
				</Tab>,
			),
		).rejects.toThrow("Tab.Panel must be used inside <Tab.Content> or <Tab.Pager>.");
	});
});
