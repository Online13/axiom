import { useState } from "react";
import { Pressable, Text } from "react-native";
import { act, render, screen, userEvent } from "@testing-library/react-native";

import { Dialog } from "@/components/ui/dialog";

import { restoreBackButton, spyOnBackButton } from "../../utils/back-button";
import { advance } from "../../utils/time";

jest.useFakeTimers();

afterEach(restoreBackButton);

type Props = {
	onOpenChange?: (open: boolean) => void;
	onDelete?: () => void;
	onDismiss?: () => void;
	dismissible?: boolean;
	closeOnPress?: boolean;
	open?: boolean;
};

function DeleteDialog({ onOpenChange, onDelete, onDismiss, dismissible, closeOnPress, open }: Props) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Trigger accessibilityRole="button" accessibilityLabel="Delete photo">
				<Text>Delete photo</Text>
			</Dialog.Trigger>
			<Dialog.Content dismissible={dismissible} onDismiss={onDismiss} testID="dialog">
				<Dialog.Title>Delete this photo?</Dialog.Title>
				<Dialog.Description>{"It can't be recovered."}</Dialog.Description>
				<Dialog.Actions>
					<Dialog.Cancel>Cancel</Dialog.Cancel>
					<Dialog.Action destructive onPress={onDelete} closeOnPress={closeOnPress}>
						Delete
					</Dialog.Action>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog.Root>
	);
}

async function openDialog(props: Props = {}) {
	const user = userEvent.setup();
	const view = await render(<DeleteDialog {...props} />);
	await user.press(screen.getByRole("button", { name: "Delete photo" }));
	return { user, view };
}

const isOpen = () => screen.queryByRole("header", { name: "Delete this photo?" }) !== null;

describe("Dialog", () => {
	test("renders nothing until its trigger opens it", async () => {
		const onOpenChange = jest.fn();
		await render(<DeleteDialog onOpenChange={onOpenChange} />);
		expect(isOpen()).toBe(false);

		await userEvent.setup().press(screen.getByRole("button", { name: "Delete photo" }));

		expect(isOpen()).toBe(true);
		expect(screen.getByText("It can't be recovered.")).toBeOnTheScreen();
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	test("is an alert, and the only thing screen readers reach while open", async () => {
		await openDialog();

		const dialog = screen.getByTestId("dialog");
		expect(dialog).toHaveProp("accessibilityRole", "alert");
		expect(dialog).toHaveProp("accessibilityViewIsModal", true);
	});

	test("an action runs, then closes the dialog, which unmounts after its exit", async () => {
		const onDelete = jest.fn();
		const onDismiss = jest.fn();
		const onOpenChange = jest.fn();
		const { user } = await openDialog({ onDelete, onDismiss, onOpenChange });

		await user.press(screen.getByRole("button", { name: "Delete" }));
		expect(onDelete).toHaveBeenCalledTimes(1);
		expect(onOpenChange).toHaveBeenLastCalledWith(false);

		await advance(250);
		expect(isOpen()).toBe(false);
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	test("closeOnPress={false} keeps it open, for an action that runs on", async () => {
		const onDelete = jest.fn();
		const { user } = await openDialog({ onDelete, closeOnPress: false });

		await user.press(screen.getByRole("button", { name: "Delete" }));
		await advance(250);

		expect(onDelete).toHaveBeenCalledTimes(1);
		expect(isOpen()).toBe(true);
	});

	test("Cancel closes it", async () => {
		const { user } = await openDialog();

		await user.press(screen.getByRole("button", { name: "Cancel" }));
		await advance(250);

		expect(isOpen()).toBe(false);
	});

	describe("dismissing", () => {
		test("a touch on the backdrop closes it; screen readers stay inside the dialog", async () => {
			const { user } = await openDialog();

			// Outside the modal surface: VoiceOver can't reach it, and uses the escape gesture instead.
			expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
			await user.press(screen.getByRole("button", { name: "Close", includeHiddenElements: true }));
			await advance(250);

			expect(isOpen()).toBe(false);
		});

		test("the Android back button closes it instead of leaving the screen", async () => {
			const back = spyOnBackButton();
			await openDialog();

			await act(() => expect(back.press()).toBe(true));
			await advance(250);

			expect(isOpen()).toBe(false);
		});

		test("dismissible={false}: no backdrop button, and back is consumed without closing", async () => {
			const back = spyOnBackButton();
			await openDialog({ dismissible: false });

			expect(screen.queryByRole("button", { name: "Close", includeHiddenElements: true })).toBeNull();
			expect(back.press()).toBe(true);
			await advance(250);

			expect(isOpen()).toBe(true);
		});
	});

	test("controlled: opens and closes with open", async () => {
		const view = await render(<DeleteDialog open={false} />);
		expect(isOpen()).toBe(false);

		await view.rerender(<DeleteDialog open />);
		expect(isOpen()).toBe(true);

		await view.rerender(<DeleteDialog open={false} />);
		await advance(250);
		expect(isOpen()).toBe(false);
	});

	test("a dialog opened over another takes the back button and the screen reader", async () => {
		const back = spyOnBackButton();
		const user = userEvent.setup();
		function Stack() {
			const [second, setSecond] = useState(false);
			return (
				<>
					<Dialog.Root defaultOpen>
						<Dialog.Content testID="first">
							<Dialog.Title>First</Dialog.Title>
							<Dialog.Action closeOnPress={false} onPress={() => setSecond(true)}>
								More
							</Dialog.Action>
						</Dialog.Content>
					</Dialog.Root>
					<Dialog.Root open={second} onOpenChange={setSecond}>
						<Dialog.Content testID="second">
							<Dialog.Title>Second</Dialog.Title>
						</Dialog.Content>
					</Dialog.Root>
				</>
			);
		}
		await render(<Stack />);
		expect(screen.getByTestId("first")).toHaveProp("accessibilityViewIsModal", true);

		await user.press(screen.getByRole("button", { name: "More" }));
		expect(screen.getByTestId("second")).toHaveProp("accessibilityViewIsModal", true);
		expect(screen.getByTestId("first", { includeHiddenElements: true })).toHaveProp("accessibilityViewIsModal", false);
		expect(screen.queryByRole("header", { name: "First" })).toBeNull();

		await act(() => back.press());
		await advance(250);

		expect(screen.queryByRole("header", { name: "Second" })).toBeNull();
		expect(screen.getByRole("header", { name: "First" })).toBeOnTheScreen();
		expect(screen.getByTestId("first")).toHaveProp("accessibilityViewIsModal", true);
	});

	test("Trigger asChild opens from the child", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(
			<Dialog.Root>
				<Dialog.Trigger asChild onPress={onPress}>
					<Pressable accessibilityRole="link" accessibilityLabel="Learn more" />
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Title>Details</Dialog.Title>
				</Dialog.Content>
			</Dialog.Root>,
		);

		await user.press(screen.getByRole("link", { name: "Learn more" }));

		expect(onPress).toHaveBeenCalledTimes(1);
		expect(screen.getByRole("header", { name: "Details" })).toBeOnTheScreen();
	});

	test("parts outside Dialog.Root throw a clear error", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});

		await expect(render(<Dialog.Content />)).rejects.toThrow("Dialog parts must be rendered inside Dialog.Root.");
	});
});
