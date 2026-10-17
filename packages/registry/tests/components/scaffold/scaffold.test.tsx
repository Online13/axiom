import { Text } from "react-native";
import { render, screen } from "@testing-library/react-native";

import { AppBar } from "@/components/ui/app-bar";
import { Scaffold } from "@/components/ui/scaffold";
import { metrics } from "@/theme/tokens";

import { withInsets } from "../../utils/safe-area";
import { testWithInsets } from "../../utils/styling";

const insets = withInsets({ top: 47, bottom: 34, left: 0, right: 0 });

describe("Scaffold", () => {
	testWithInsets("applies the top and bottom insets once, on the root", async () => {
		await render(
			<Scaffold testID="screen">
				<Scaffold.AppBar testID="bar">
					<AppBar.Row>
						<AppBar.Title>Home</AppBar.Title>
					</AppBar.Row>
				</Scaffold.AppBar>
				<Scaffold.Content>
					<Text>Body</Text>
				</Scaffold.Content>
				<Scaffold.Footer testID="footer">
					<Text>Actions</Text>
				</Scaffold.Footer>
			</Scaffold>,
			{ wrapper: insets },
		);

		expect(screen.getByTestId("screen")).toHaveStyle({ paddingTop: 47, paddingBottom: 34 });
		// The bar and the footer don't add the same insets again.
		expect(screen.getByTestId("bar")).toHaveStyle({ paddingTop: 0 });
		expect(screen.getByTestId("footer")).toHaveStyle({ paddingBottom: metrics.screenMargin });
	});

	testWithInsets("a screen that leaves the bottom edge to its footer gets it there", async () => {
		await render(
			<Scaffold testID="screen" safeAreaEdges={["top"]}>
				<Scaffold.Footer testID="footer" safeArea>
					<Text>Pay</Text>
				</Scaffold.Footer>
			</Scaffold>,
			{ wrapper: insets },
		);

		expect(screen.getByTestId("screen")).toHaveStyle({ paddingBottom: 0 });
		expect(screen.getByTestId("footer")).toHaveStyle({ paddingBottom: metrics.screenMargin + 34 });
	});

	test("Content scrolls and keeps taps on fields while the keyboard is up", async () => {
		await render(
			<Scaffold>
				<Scaffold.Content testID="content">
					<Text>Body</Text>
				</Scaffold.Content>
			</Scaffold>,
		);

		const content = screen.getByTestId("content");
		expect(content.type).toBe("RCTScrollView");
		expect(content).toHaveProp("keyboardShouldPersistTaps", "handled");
	});

	test("Content with scrollable={false} leaves scrolling to its child", async () => {
		await render(
			<Scaffold>
				<Scaffold.Content scrollable={false}>
					<Text>Map</Text>
				</Scaffold.Content>
			</Scaffold>,
		);

		expect(screen.container.queryAll((node) => node.type === "RCTScrollView")).toHaveLength(0);
		expect(screen.getByText("Map")).toBeOnTheScreen();
	});
});
