import { render, screen, userEvent } from "@testing-library/react-native";

import { Alert } from "@/components/ui/alert";

jest.useFakeTimers();

describe("Alert", () => {
	test("shows its title and description", async () => {
		await render(<Alert title="Saved">Your changes are live.</Alert>);

		expect(screen.getByText("Saved")).toBeOnTheScreen();
		expect(screen.getByText("Your changes are live.")).toBeOnTheScreen();
	});

	test("an error is an alert, announced as soon as it appears", async () => {
		await render(
			<Alert variant="error" title="Payment failed" testID="alert">
				Check your card.
			</Alert>,
		);

		const alert = screen.getByTestId("alert");
		expect(alert).toHaveProp("accessibilityRole", "alert");
		expect(alert).toHaveProp("accessibilityLiveRegion", "assertive");
	});

	test("other variants are quiet unless asked", async () => {
		const view = await render(<Alert variant="info" title="Tip" testID="alert" />);
		expect(screen.getByTestId("alert")).toHaveProp("accessibilityLiveRegion", "none");
		expect(screen.getByTestId("alert")).not.toHaveProp("accessibilityRole", "alert");

		await view.rerender(<Alert variant="info" title="Tip" testID="alert" accessibilityLiveRegion="polite" />);
		expect(screen.getByTestId("alert")).toHaveProp("accessibilityLiveRegion", "polite");
	});

	test("onDismiss adds a 'Dismiss' button; hiding is up to the caller", async () => {
		const user = userEvent.setup();
		const onDismiss = jest.fn();
		await render(<Alert title="Update available" onDismiss={onDismiss} />);

		await user.press(screen.getByRole("button", { name: "Dismiss" }));

		expect(onDismiss).toHaveBeenCalledTimes(1);
		expect(screen.getByText("Update available")).toBeOnTheScreen();
	});

	test("without onDismiss there is no close button", async () => {
		await render(<Alert title="Note" />);

		expect(screen.queryByRole("button")).toBeNull();
	});

	test("Alert.Description and Alert.Action compose the body", async () => {
		const user = userEvent.setup();
		const onRetry = jest.fn();
		await render(
			<Alert variant="warning" title="Offline">
				<Alert.Description>Changes will sync later.</Alert.Description>
				<Alert.Action onPress={onRetry}>Retry</Alert.Action>
			</Alert>,
		);

		await user.press(screen.getByRole("button", { name: "Retry" }));

		expect(screen.getByText("Changes will sync later.")).toBeOnTheScreen();
		expect(onRetry).toHaveBeenCalledTimes(1);
	});
});
