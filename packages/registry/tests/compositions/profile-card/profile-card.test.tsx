import { render, screen, userEvent } from "@testing-library/react-native";

import { ProfileCard } from "@/components/compositions/profile-card";

jest.useFakeTimers();

const PROFILE = {
	name: "Lena Moreau",
	handle: "@lena.m",
	bio: "Designer in Lyon.",
	stats: [
		{ value: "128", label: "Posts" },
		{ value: "12.4k", label: "Followers" },
	],
};

describe("ProfileCard", () => {
	test("shows the name, handle and bio; each stat is read as value then label", async () => {
		await render(<ProfileCard {...PROFILE} />);

		expect(screen.getByText("Lena Moreau")).toBeOnTheScreen();
		expect(screen.getByText("@lena.m")).toBeOnTheScreen();
		expect(screen.getByText("Designer in Lyon.")).toBeOnTheScreen();
		expect(screen.getByLabelText("12.4k Followers")).toBeOnTheScreen();
	});

	test("Follow names the person; once following, it says so and reports the state", async () => {
		const user = userEvent.setup();
		const onFollow = jest.fn();
		const view = await render(<ProfileCard {...PROFILE} onFollow={onFollow} />);

		await user.press(screen.getByRole("button", { name: "Follow, Lena Moreau" }));
		expect(onFollow).toHaveBeenCalledTimes(1);

		await view.rerender(<ProfileCard {...PROFILE} onFollow={onFollow} following />);
		expect(screen.getByRole("button", { name: "Following, Lena Moreau" })).toBeSelected();
	});

	test("Message names the person, and the card's own press stays separate", async () => {
		const user = userEvent.setup();
		const onMessage = jest.fn();
		const onPress = jest.fn();
		await render(<ProfileCard {...PROFILE} onMessage={onMessage} onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Message, Lena Moreau" }));
		expect(onMessage).toHaveBeenCalledTimes(1);
		expect(onPress).not.toHaveBeenCalled();

		await user.press(screen.getByRole("button", { name: "Lena Moreau" }));
		expect(onPress).toHaveBeenCalledTimes(1);
	});
});
