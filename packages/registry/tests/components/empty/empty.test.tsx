import { render, screen, userEvent } from "@testing-library/react-native";

import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";

jest.useFakeTimers();

function NoResults({ onClear = () => {} }: { onClear?: () => void }) {
	return (
		<Empty testID="empty">
			<Empty.Header testID="header">
				<Empty.Media icon="search" />
				<Empty.Title>No results</Empty.Title>
				<Empty.Description>Try another search.</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button onPress={onClear}>Clear filters</Button>
			</Empty.Content>
		</Empty>
	);
}

describe("Empty", () => {
	test("the header is read as one element: title then description", async () => {
		await render(<NoResults />);

		const header = screen.getByTestId("header");
		expect(header).toHaveProp("accessible", true);
		expect(header).toHaveTextContent("No resultsTry another search.");
	});

	test("the title is a header", async () => {
		await render(<NoResults />);

		expect(screen.getByRole("header", { name: "No results" })).toBeOnTheScreen();
	});

	test("actions stay outside the header and reachable on their own", async () => {
		const user = userEvent.setup();
		const onClear = jest.fn();
		await render(<NoResults onClear={onClear} />);

		await user.press(screen.getByRole("button", { name: "Clear filters" }));

		expect(onClear).toHaveBeenCalledTimes(1);
	});

	test("custom media replaces the icon tile", async () => {
		await render(
			<Empty>
				<Empty.Media testID="media">
					<Button>Illustration</Button>
				</Empty.Media>
			</Empty>,
		);

		expect(screen.getByTestId("media")).toHaveTextContent("Illustration");
	});

	test("both sizes render the same structure", async () => {
		await render(
			<Empty size="sm" fill={false}>
				<Empty.Header>
					<Empty.Title>Nothing yet</Empty.Title>
				</Empty.Header>
			</Empty>,
		);

		expect(screen.getByRole("header", { name: "Nothing yet" })).toBeOnTheScreen();
	});
});
