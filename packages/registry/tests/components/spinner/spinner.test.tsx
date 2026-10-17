import { render, screen } from "@testing-library/react-native";

import { Spinner } from "@/components/ui/spinner";

import { advance } from "../../utils/time";

jest.useFakeTimers();

describe("Spinner", () => {
	test("is a busy progressbar announced as 'Loading'", async () => {
		await render(<Spinner />);

		const spinner = screen.getByRole("progressbar", { name: "Loading" });
		expect(spinner).toBeBusy();
	});

	test("announces the label it is given", async () => {
		await render(<Spinner label="Sending message" />);

		expect(screen.getByRole("progressbar", { name: "Sending message" })).toBeOnTheScreen();
	});

	test("animating={false} hides it from screen readers but keeps its space", async () => {
		await render(<Spinner animating={false} testID="spinner" size={24} />);

		const spinner = screen.getByTestId("spinner", { includeHiddenElements: true });
		expect(screen.queryByRole("progressbar")).toBeNull();
		expect(spinner).not.toBeVisible();
		expect(spinner).toHaveStyle({ width: 24, height: 24 });
	});

	test("with a delay, appears only once the delay is over", async () => {
		await render(<Spinner delay={300} />);

		expect(screen.queryByRole("progressbar")).toBeNull();
		await advance(299);
		expect(screen.queryByRole("progressbar")).toBeNull();
		await advance(1);
		expect(screen.getByRole("progressbar", { name: "Loading" })).toBeOnTheScreen();
	});
});
