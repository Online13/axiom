import { Text } from "react-native";
import { render, screen } from "@testing-library/react-native";

import type { TestInstance } from "test-renderer";

import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton", () => {
	test("shows a placeholder, hidden from screen readers, instead of the content", async () => {
		await render(
			<Skeleton testID="placeholder" width={120} height={20}>
				<Text>Ada Lovelace</Text>
			</Skeleton>,
		);

		expect(screen.getByTestId("placeholder", { includeHiddenElements: true })).not.toBeVisible();
		expect(screen.queryByText("Ada Lovelace")).toBeNull();
	});

	test("loading={false} renders the content instead", async () => {
		const view = await render(
			<Skeleton testID="placeholder">
				<Text>Ada Lovelace</Text>
			</Skeleton>,
		);

		await view.rerender(
			<Skeleton testID="placeholder" loading={false}>
				<Text>Ada Lovelace</Text>
			</Skeleton>,
		);

		expect(screen.queryByTestId("placeholder", { includeHiddenElements: true })).toBeNull();
		expect(screen.getByText("Ada Lovelace")).toBeOnTheScreen();
	});

	test("every animation, and none, renders the placeholder", async () => {
		await render(
			<>
				<Skeleton testID="shimmer" variant="shimmer" />
				<Skeleton testID="pulse" variant="pulse" />
				<Skeleton testID="none" variant="none" />
			</>,
		);

		for (const id of ["shimmer", "pulse", "none"]) {
			expect(screen.getByTestId(id, { includeHiddenElements: true })).toBeOnTheScreen();
		}
	});

	describe("Skeleton.Text", () => {
		test("draws one placeholder per line", async () => {
			await render(<Skeleton.Text lines={4} testID="paragraph" />);

			const paragraph = screen.getByTestId("paragraph");
			expect(paragraph.children).toHaveLength(4);
		});

		test("the last line of several is shorter, like the end of a paragraph", async () => {
			await render(<Skeleton.Text lines={3} testID="paragraph" />);

			const lines = screen.getByTestId("paragraph").children as TestInstance[];
			expect(lines[0]).toHaveStyle({ width: "100%" });
			expect(lines[2]).toHaveStyle({ width: "60%" });
		});

		test("loading={false} renders the text", async () => {
			await render(
				<Skeleton.Text loading={false}>
					<Text>Loaded paragraph</Text>
				</Skeleton.Text>,
			);

			expect(screen.getByText("Loaded paragraph")).toBeOnTheScreen();
		});
	});
});
