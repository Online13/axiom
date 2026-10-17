import { render, screen } from "@testing-library/react-native";

import { Icon, iconColor } from "@/components/ui/icon";

describe("Icon", () => {
	test("is decorative by default: hidden from screen readers", async () => {
		await render(<Icon name="search" testID="icon" />);

		expect(screen.queryByTestId("icon")).toBeNull();
		expect(screen.getByTestId("icon", { includeHiddenElements: true })).not.toBeVisible();
	});

	test("with a label it is an image screen readers announce", async () => {
		await render(<Icon name="warning" accessibilityLabel="Warning" />);

		expect(screen.getByRole("image", { name: "Warning" })).toBeOnTheScreen();
	});

	test("takes a size in points", async () => {
		// A token size (`lg`) is a class with NativeWind and Uniwind: only a number is a style everywhere.
		await render(<Icon name="add" size={30} accessibilityLabel="Add" />);

		expect(screen.getByRole("image", { name: "Add" })).toHaveStyle({ width: 30, height: 30 });
	});
});

describe("iconColor", () => {
	test("resolves content and feedback roles from the theme, and passes a raw color through", () => {
		const colors = { content: { muted: "#777" }, feedback: { error: "#d00" } } as unknown as Parameters<typeof iconColor>[0];

		expect(iconColor(colors, "muted")).toBe("#777");
		expect(iconColor(colors, "error")).toBe("#d00");
		expect(iconColor(colors, "#ff0000")).toBe("#ff0000");
	});
});
