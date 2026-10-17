import { Text } from "react-native";
import { render, screen } from "@testing-library/react-native";

import { Title } from "@/components/ui/title";

describe("Title", () => {
	test("is a header, so screen readers can jump between titles", async () => {
		await render(<Title>Settings</Title>);

		expect(screen.getByRole("header", { name: "Settings" })).toBeOnTheScreen();
	});

	test("every variant stays a header", async () => {
		const variants = ["display", "headingLg", "heading", "headingSm", "subheading"] as const;
		await render(
			<>
				{variants.map((variant) => (
					<Title key={variant} variant={variant}>
						{variant}
					</Title>
				))}
			</>,
		);

		expect(screen.getAllByRole("header")).toHaveLength(variants.length);
	});

	test("the caller can opt out of the header role", async () => {
		await render(<Title accessibilityRole="none">Decorative</Title>);

		expect(screen.queryByRole("header")).toBeNull();
		expect(screen.getByText("Decorative")).toBeOnTheScreen();
	});

	test("asChild makes its child the header", async () => {
		await render(
			<Title asChild>
				<Text testID="custom">Profile</Text>
			</Title>,
		);

		expect(screen.getByTestId("custom")).toHaveProp("accessibilityRole", "header");
	});
});
