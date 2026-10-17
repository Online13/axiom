import { render, screen, fireEvent } from "@testing-library/react-native";

import { Avatar, initials } from "@/components/ui/avatar";

const image = () => screen.container.queryAll((node) => node.type === "Image")[0];

describe("Avatar", () => {
	test("is an image named after the person", async () => {
		await render(<Avatar name="Ada Lovelace" />);

		expect(screen.getByRole("image", { name: "Ada Lovelace" })).toBeOnTheScreen();
	});

	test("adds the status to the name", async () => {
		await render(<Avatar name="Ada Lovelace" status="online" />);

		expect(screen.getByRole("image", { name: "Ada Lovelace, online" })).toBeOnTheScreen();
	});

	test("without a name or label it is decorative", async () => {
		await render(<Avatar fallback="AL" />);

		expect(screen.queryByRole("image")).toBeNull();
	});

	test("shows the initials while there is no image", async () => {
		await render(<Avatar name="Ada King Lovelace" />);

		expect(screen.getByText("AL")).toBeOnTheScreen();
	});

	test("an explicit fallback wins over the initials", async () => {
		await render(<Avatar name="Ada Lovelace" fallback="🦊" />);

		expect(screen.getByText("🦊")).toBeOnTheScreen();
		expect(screen.queryByText("AL")).toBeNull();
	});

	test("keeps the initials while the image loads, and hides them once it has", async () => {
		await render(<Avatar name="Ada Lovelace" source={{ uri: "https://example.com/ada.png" }} />);
		expect(screen.getByText("AL")).toBeOnTheScreen();

		await fireEvent(image(), "load");

		expect(screen.queryByText("AL")).toBeNull();
	});

	test("falls back to the initials when the image fails", async () => {
		await render(<Avatar name="Ada Lovelace" source={{ uri: "https://example.com/404.png" }} />);

		await fireEvent(image(), "error");

		expect(image()).toBeUndefined();
		expect(screen.getByText("AL")).toBeOnTheScreen();
	});

	describe("Avatar.Group", () => {
		test("shows every avatar and an overflow read as '3 more'", async () => {
			await render(
				<Avatar.Group>
					<Avatar name="Ada Lovelace" />
					<Avatar name="Alan Turing" />
					<Avatar.Overflow count={3} />
				</Avatar.Group>,
			);

			expect(screen.getAllByRole("image")).toHaveLength(2);
			expect(screen.getByLabelText("3 more")).toHaveTextContent("+3");
		});
	});
});

describe("initials", () => {
	test.each([
		["Ada Lovelace", "AL"],
		["ada king lovelace", "AL"],
		["  Plato  ", "P"],
		["Jean-Luc Picard", "JP"],
		["", ""],
	])("%j → %j", (name, expected) => {
		expect(initials(name)).toBe(expected);
	});
});
