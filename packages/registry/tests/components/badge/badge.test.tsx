import { Text } from "react-native";
import { render, screen } from "@testing-library/react-native";

import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
	test("shows its label", async () => {
		await render(<Badge variant="success">Paid</Badge>);

		expect(screen.getByText("Paid")).toBeOnTheScreen();
	});

	describe("counter", () => {
		test("shows the count", async () => {
			await render(<Badge count={7} />);

			expect(screen.getByText("7")).toBeOnTheScreen();
		});

		test("caps the count at max, 99 by default", async () => {
			const view = await render(<Badge count={100} />);
			expect(screen.getByText("99+")).toBeOnTheScreen();

			await view.rerender(<Badge count={12} max={9} />);
			expect(screen.getByText("9+")).toBeOnTheScreen();

			await view.rerender(<Badge count={99} />);
			expect(screen.getByText("99")).toBeOnTheScreen();
		});

		test("0 renders nothing at all", async () => {
			await render(<Badge count={0} testID="badge" />);

			expect(screen.queryByTestId("badge")).toBeNull();
		});

		test("is read only when it says what it counts", async () => {
			const view = await render(<Badge count={3} testID="badge" />);
			expect(screen.getByTestId("badge")).toHaveProp("accessible", false);

			await view.rerender(<Badge count={3} testID="badge" accessibilityLabel="3 unread messages" />);
			expect(screen.getByLabelText("3 unread messages")).toBeOnTheScreen();
		});
	});

	test("a lone dot has no text", async () => {
		await render(<Badge dot testID="dot" />);

		expect(screen.getByTestId("dot")).toHaveTextContent("");
	});

	describe("Badge.Anchor", () => {
		test("renders the decorated element and its badge", async () => {
			await render(
				<Badge.Anchor badge={<Badge count={2} />}>
					<Text>Avatar</Text>
				</Badge.Anchor>,
			);

			expect(screen.getByText("Avatar")).toBeOnTheScreen();
			expect(screen.getByText("2")).toBeOnTheScreen();
		});

		test("shows no badge for null, and keeps the element", async () => {
			await render(
				<Badge.Anchor badge={null} testID="anchor">
					<Text>Avatar</Text>
				</Badge.Anchor>,
			);

			expect(screen.getByTestId("anchor")).toHaveTextContent("Avatar");
		});
	});
});
