import { render, screen, userEvent } from "@testing-library/react-native";

import { SettingsSection } from "@/components/blocks/settings-section";
import { SettingsItem } from "@/components/compositions/settings-item";

jest.useFakeTimers();

function Notifications({ onQuietHours = () => {} }: { onQuietHours?: () => void }) {
	return (
		<SettingsSection title="Notifications" footer="Quiet hours mute everything but calls.">
			<SettingsItem title="Push" trailing="switch" divider />
			<SettingsItem title="Quiet hours" value="22:00" onPress={onQuietHours} />
		</SettingsSection>
	);
}

describe("SettingsSection", () => {
	test("the title is a header screen readers can jump to", async () => {
		await render(<Notifications />);

		expect(screen.getByRole("header", { name: "Notifications" })).toBeOnTheScreen();
	});

	test("shows the footer note under the rows", async () => {
		await render(<Notifications />);

		expect(screen.getByText("Quiet hours mute everything but calls.")).toBeOnTheScreen();
	});

	test("its rows stay independent controls", async () => {
		const user = userEvent.setup();
		const onQuietHours = jest.fn();
		await render(<Notifications onQuietHours={onQuietHours} />);

		await user.press(screen.getByRole("switch", { name: "Push" }));
		await user.press(screen.getByRole("button", { name: "Quiet hours" }));

		expect(screen.getByRole("switch", { name: "Push" })).toBeChecked();
		expect(onQuietHours).toHaveBeenCalledTimes(1);
	});

	test("without a title or a footer, only the rows", async () => {
		await render(
			<SettingsSection>
				<SettingsItem title="About" onPress={() => {}} />
			</SettingsSection>,
		);

		expect(screen.queryByRole("header")).toBeNull();
		expect(screen.getByRole("button", { name: "About" })).toBeOnTheScreen();
	});
});
