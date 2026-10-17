import { render, screen, userEvent } from "@testing-library/react-native";

import { ProfileAppBar } from "@/components/compositions/profile-app-bar";
import { IconButton } from "@/components/ui/icon-button";

jest.useFakeTimers();

describe("ProfileAppBar", () => {
	test("reads the greeting with the name", async () => {
		await render(<ProfileAppBar name="Lena Moreau" greeting="Good morning" />);

		expect(screen.getByLabelText("Good morning, Lena Moreau")).toBeOnTheScreen();
		expect(screen.queryByRole("button")).toBeNull();
	});

	test("onProfilePress makes the avatar and name one 'Profile' button", async () => {
		const user = userEvent.setup();
		const onProfilePress = jest.fn();
		await render(<ProfileAppBar name="Lena Moreau" onProfilePress={onProfilePress} />);

		await user.press(screen.getByRole("button", { name: "Profile, Lena Moreau" }));

		expect(onProfilePress).toHaveBeenCalledTimes(1);
	});

	test("renders its actions as written", async () => {
		const user = userEvent.setup();
		const onBell = jest.fn();
		await render(
			<ProfileAppBar name="Lena">
				<IconButton icon="notifications" accessibilityLabel="Notifications" onPress={onBell} />
				<IconButton icon="more" accessibilityLabel="More" />
			</ProfileAppBar>,
		);

		await user.press(screen.getByRole("button", { name: "Notifications" }));

		expect(onBell).toHaveBeenCalledTimes(1);
		expect(screen.getByRole("button", { name: "More" })).toBeOnTheScreen();
	});
});
