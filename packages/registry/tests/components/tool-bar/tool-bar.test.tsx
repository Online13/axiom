import { render, screen, userEvent } from "@testing-library/react-native";

import { ToolBar } from "@/components/ui/tool-bar";
import { spacing } from "@/theme/tokens";

import { withInsets } from "../../utils/safe-area";
import { testWithInsets } from "../../utils/styling";

jest.useFakeTimers();

function Selection(props: Partial<React.ComponentProps<typeof ToolBar>> & { onDelete?: () => void }) {
	const { onDelete = () => {}, ...bar } = props;
	return (
		<ToolBar testID="bar" {...bar}>
			<ToolBar.Action icon="share" label="Share" />
			<ToolBar.Action icon="favorite" label="Favorite" selected />
			<ToolBar.Separator testID="separator" />
			<ToolBar.Action icon="delete" label="Delete" destructive onPress={onDelete} />
			<ToolBar.Action icon="edit" label="Edit" disabled />
		</ToolBar>
	);
}

describe("ToolBar", () => {
	test("is a toolbar named 'Actions' by default", async () => {
		await render(<Selection />);

		expect(screen.getByTestId("bar")).toHaveProp("accessibilityRole", "toolbar");
		expect(screen.getByLabelText("Actions")).toBeOnTheScreen();
	});

	test("each action is a button named by its label", async () => {
		const user = userEvent.setup();
		const onDelete = jest.fn();
		await render(<Selection onDelete={onDelete} />);

		await user.press(screen.getByRole("button", { name: "Delete" }));

		expect(onDelete).toHaveBeenCalledTimes(1);
	});

	test("reports a selected toggle and a disabled action", async () => {
		await render(<Selection />);

		expect(screen.getByRole("button", { name: "Favorite" })).toBeSelected();
		expect(screen.getByRole("button", { name: "Edit" })).toBeDisabled();
	});

	test("the separator is hidden from screen readers", async () => {
		await render(<Selection />);

		expect(screen.queryByTestId("separator")).toBeNull();
	});

	test("a docked bar shows labels; a floating one hides them but keeps the names", async () => {
		const view = await render(<Selection />);
		expect(screen.getByText("Share")).toBeOnTheScreen();

		await view.rerender(<Selection placement="floating" />);
		expect(screen.queryByText("Share")).toBeNull();
		expect(screen.getByRole("button", { name: "Share" })).toBeOnTheScreen();
	});

	testWithInsets("a docked bar pads the bottom inset; a floating one lifts itself above it", async () => {
		const wrapper = withInsets({ bottom: 34 });
		const view = await render(<Selection />, { wrapper });
		expect(screen.getByTestId("bar")).toHaveStyle({ paddingBottom: spacing[2] + 34 });

		await view.rerender(<Selection placement="floating" />);
		expect(screen.getByTestId("bar")).toHaveStyle({
			paddingBottom: spacing[2],
			marginBottom: 34 + spacing[2],
		});
	});
});
