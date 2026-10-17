import { render, screen } from "@testing-library/react-native";

import { Separator } from "@/components/ui/separator";

describe("Separator", () => {
	test("is decorative by default: hidden from screen readers", async () => {
		await render(<Separator testID="line" />);

		expect(screen.queryByTestId("line")).toBeNull();
		expect(screen.getByTestId("line", { includeHiddenElements: true })).not.toBeVisible();
	});

	test("can be made reachable when it carries meaning", async () => {
		await render(<Separator testID="line" decorative={false} />);

		const line = screen.getByTestId("line");
		expect(line).toBeVisible();
		expect(line).toHaveProp("accessible", true);
	});

	test("shows a label between two lines", async () => {
		await render(<Separator label="or" testID="divider" decorative={false} />);

		expect(screen.getByTestId("divider")).toHaveTextContent("or");
	});

	test("a vertical separator ignores the label", async () => {
		await render(<Separator orientation="vertical" label="or" testID="divider" />);

		expect(screen.getByTestId("divider", { includeHiddenElements: true })).toHaveTextContent("");
	});
});
