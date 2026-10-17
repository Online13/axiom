import { render, screen, userEvent } from "@testing-library/react-native";

import { ArticleCard } from "@/components/compositions/article-card";

jest.useFakeTimers();

const ARTICLE = {
	title: "The quiet return of trains",
	image: { uri: "https://example.com/train.jpg" },
	category: "World",
	excerpt: "Night trains are back across Europe.",
	author: { name: "Lena Moreau" },
	meta: "Sep 24 · 6 min read",
};

describe("ArticleCard", () => {
	test("shows the category, title, excerpt, author and meta", async () => {
		await render(<ArticleCard {...ARTICLE} />);

		expect(screen.getByText("World")).toBeOnTheScreen();
		expect(screen.getByRole("header", { name: "The quiet return of trains" })).toBeOnTheScreen();
		expect(screen.getByText("Night trains are back across Europe.")).toBeOnTheScreen();
		expect(screen.getByText("Lena Moreau")).toBeOnTheScreen();
		expect(screen.getByText("Sep 24 · 6 min read")).toBeOnTheScreen();
	});

	test("pressable, it is one button read as category, title and author", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<ArticleCard {...ARTICLE} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "World, The quiet return of trains, Lena Moreau" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("without onPress it is no button", async () => {
		await render(<ArticleCard {...ARTICLE} />);

		expect(screen.queryByRole("button")).toBeNull();
	});

	test("leaves out what isn't given, the author row included", async () => {
		await render(<ArticleCard title="Untitled" image={ARTICLE.image} onPress={() => {}} />);

		expect(screen.getByRole("button", { name: "Untitled" })).toBeOnTheScreen();
		expect(screen.queryByText("Lena Moreau")).toBeNull();
		expect(screen.queryByRole("image")).toBeNull();
	});
});
