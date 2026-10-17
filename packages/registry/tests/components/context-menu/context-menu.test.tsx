import { Text } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";

import { ContextMenu } from "@/components/ui/context-menu";

import { placeInWindow } from "../../utils/events";
import { advance } from "../../utils/time";

jest.useFakeTimers();

beforeEach(() => {
	jest.clearAllMocks();
	placeInWindow({ x: 16, y: 200, width: 358, height: 80 });
});

function Message({ onCopy, preview, haptic }: { onCopy?: () => void; preview?: boolean | React.ReactNode; haptic?: false }) {
	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger accessibilityLabel="Message from Ada" preview={preview} haptic={haptic}>
				<Text>See you at 6</Text>
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Item onPress={onCopy}>Copy</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	);
}

describe("ContextMenu", () => {
	test("tells screen reader users to long press", async () => {
		await render(<Message />);

		expect(screen.getByRole("button", { name: "Message from Ada" })).toHaveProp(
			"accessibilityHint",
			"Long press for options",
		);
	});

	test("a tap does nothing; a long press opens the menu with a medium haptic", async () => {
		const user = userEvent.setup();
		await render(<Message />);
		const trigger = screen.getByRole("button", { name: "Message from Ada" });

		await user.press(trigger);
		expect(screen.queryByRole("menuitem")).toBeNull();

		await user.longPress(trigger, { duration: 600 });
		expect(screen.getByRole("menuitem", { name: "Copy" })).toBeOnTheScreen();
		expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
	});

	test("lifts a copy of the pressed content above the backdrop", async () => {
		const user = userEvent.setup();
		await render(<Message />);

		await user.longPress(screen.getByRole("button", { name: "Message from Ada" }), { duration: 600 });

		expect(screen.getAllByText("See you at 6", { includeHiddenElements: true })).toHaveLength(2);
	});

	test("preview={false} lifts nothing; a node is shown in its place", async () => {
		const user = userEvent.setup();
		const view = await render(<Message preview={false} />);
		await user.longPress(screen.getByRole("button", { name: "Message from Ada" }), { duration: 600 });
		expect(screen.getAllByText("See you at 6", { includeHiddenElements: true })).toHaveLength(1);

		await view.unmount();
		await render(<Message preview={<Text>Preview card</Text>} />);
		await user.longPress(screen.getByRole("button", { name: "Message from Ada" }), { duration: 600 });
		expect(screen.getByText("Preview card", { includeHiddenElements: true })).toBeOnTheScreen();
	});

	test("picking an item closes the menu, then runs it", async () => {
		const user = userEvent.setup();
		const onCopy = jest.fn();
		await render(<Message onCopy={onCopy} />);

		await user.longPress(screen.getByRole("button", { name: "Message from Ada" }), { duration: 600 });
		await user.press(screen.getByRole("menuitem", { name: "Copy" }));
		await advance(200);

		expect(onCopy).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole("menuitem", { includeHiddenElements: true })).toBeNull();
	});

	test("haptic={false} opens silently", async () => {
		const user = userEvent.setup();
		await render(<Message haptic={false} />);

		await user.longPress(screen.getByRole("button", { name: "Message from Ada" }), { duration: 600 });

		expect(Haptics.impactAsync).not.toHaveBeenCalled();
	});
});
