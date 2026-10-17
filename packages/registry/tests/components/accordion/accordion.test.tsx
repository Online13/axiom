import { useState } from "react";
import { TextInput } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";

import { Accordion, type AccordionProps } from "@/components/ui/accordion";

import { advance } from "../../utils/time";

jest.useFakeTimers();

function Faq(props: Partial<AccordionProps> & { disabledItem?: string }) {
	const { disabledItem, ...accordion } = props;
	return (
		<Accordion {...accordion}>
			{[
				["shipping", "Shipping", "Ships in 2 days."],
				["returns", "Returns", "30 days to return."],
				["warranty", "Warranty", "Two years."],
			].map(([value, title, body]) => (
				<Accordion.Item key={value} value={value} disabled={value === disabledItem}>
					<Accordion.Trigger>{title}</Accordion.Trigger>
					<Accordion.Content>{body}</Accordion.Content>
				</Accordion.Item>
			))}
		</Accordion>
	);
}

const trigger = (name: string) => screen.getByRole("button", { name });

describe("Accordion", () => {
	test("each trigger is a collapsed button, and closed content isn't rendered", async () => {
		await render(<Faq />);

		expect(trigger("Shipping")).toBeCollapsed();
		expect(screen.queryByText("Ships in 2 days.", { includeHiddenElements: true })).toBeNull();
	});

	test("pressing a trigger expands its section", async () => {
		const user = userEvent.setup();
		await render(<Faq />);

		await user.press(trigger("Shipping"));

		expect(trigger("Shipping")).toBeExpanded();
		// In the accessibility tree; the height and fade are animated, and checked on a device.
		expect(screen.getByText("Ships in 2 days.")).toBeOnTheScreen();
	});

	describe("single", () => {
		test("opening a section closes the open one", async () => {
			const user = userEvent.setup();
			const onValueChange = jest.fn();
			await render(<Faq onValueChange={onValueChange} />);

			await user.press(trigger("Shipping"));
			await user.press(trigger("Returns"));

			expect(trigger("Shipping")).toBeCollapsed();
			expect(trigger("Returns")).toBeExpanded();
			expect(onValueChange.mock.calls).toEqual([["shipping"], ["returns"]]);
		});

		test("the closing section leaves the accessibility tree at once, then unmounts", async () => {
			const user = userEvent.setup();
			await render(<Faq defaultValue="shipping" />);

			await user.press(trigger("Returns"));
			expect(screen.queryByText("Ships in 2 days.")).toBeNull();

			await advance(300);
			expect(screen.queryByText("Ships in 2 days.", { includeHiddenElements: true })).toBeNull();
		});

		test("collapsible by default: pressing the open section closes it", async () => {
			const user = userEvent.setup();
			const onValueChange = jest.fn();
			await render(<Faq defaultValue="shipping" onValueChange={onValueChange} />);

			await user.press(trigger("Shipping"));

			expect(trigger("Shipping")).toBeCollapsed();
			expect(onValueChange).toHaveBeenCalledWith("");
		});

		test("collapsible={false}: one section always stays open", async () => {
			const user = userEvent.setup();
			const onValueChange = jest.fn();
			await render(<Faq defaultValue="shipping" collapsible={false} onValueChange={onValueChange} />);

			await user.press(trigger("Shipping"));

			expect(trigger("Shipping")).toBeExpanded();
			expect(onValueChange).not.toHaveBeenCalled();
		});
	});

	describe("multiple", () => {
		test("sections open and close independently, reported as a list", async () => {
			const user = userEvent.setup();
			const onValueChange = jest.fn();
			await render(<Faq type="multiple" onValueChange={onValueChange} />);

			await user.press(trigger("Shipping"));
			await user.press(trigger("Warranty"));
			await user.press(trigger("Shipping"));

			expect(trigger("Shipping")).toBeCollapsed();
			expect(trigger("Warranty")).toBeExpanded();
			expect(onValueChange.mock.calls).toEqual([
				[["shipping"]],
				[["shipping", "warranty"]],
				[["warranty"]],
			]);
		});

		test("starts with the sections of defaultValue open", async () => {
			await render(<Faq type="multiple" defaultValue={["returns", "warranty"]} />);

			expect(trigger("Shipping")).toBeCollapsed();
			expect(trigger("Returns")).toBeExpanded();
			expect(trigger("Warranty")).toBeExpanded();
		});
	});

	test("controlled: sections follow value only", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		const view = await render(<Faq value="shipping" onValueChange={onValueChange} />);

		await user.press(trigger("Returns"));
		expect(onValueChange).toHaveBeenCalledWith("returns");
		expect(trigger("Shipping")).toBeExpanded();

		await view.rerender(<Faq value="returns" onValueChange={onValueChange} />);
		expect(trigger("Returns")).toBeExpanded();
	});

	test("a disabled item can't be opened, and stays closed even when its value is open", async () => {
		const user = userEvent.setup();
		const onValueChange = jest.fn();
		await render(<Faq defaultValue="returns" disabledItem="returns" onValueChange={onValueChange} />);

		expect(trigger("Returns")).toBeCollapsed();
		expect(trigger("Returns")).toBeDisabled();
		await user.press(trigger("Returns"));

		expect(onValueChange).not.toHaveBeenCalled();
	});

	test("a disabled accordion disables every trigger", async () => {
		await render(<Faq disabled />);

		for (const name of ["Shipping", "Returns", "Warranty"]) {
			expect(trigger(name)).toBeDisabled();
		}
	});

	test("forceMount keeps closed content mounted, so its state survives", async () => {
		const user = userEvent.setup();
		function Notes() {
			const [, rerender] = useState(0);
			return (
				<Accordion defaultValue="notes">
					<Accordion.Item value="notes">
						<Accordion.Trigger>Notes</Accordion.Trigger>
						<Accordion.Content forceMount>
							<TextInput accessibilityLabel="Note" defaultValue="" onChange={() => rerender((n) => n + 1)} />
						</Accordion.Content>
					</Accordion.Item>
				</Accordion>
			);
		}
		await render(<Notes />);

		await user.type(screen.getByLabelText("Note"), "Buy milk");
		await user.press(trigger("Notes"));
		await advance(300);
		await user.press(trigger("Notes"));

		expect(screen.getByLabelText("Note")).toHaveDisplayValue("Buy milk");
	});

	test("parts used outside their parent throw a clear error", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});

		await expect(render(<Accordion.Item value="a" />)).rejects.toThrow(
			"Accordion.Item must be rendered inside Accordion.",
		);
		await expect(render(<Accordion.Trigger>Lonely</Accordion.Trigger>)).rejects.toThrow(
			"Accordion.Trigger and Accordion.Content must be rendered inside Accordion.Item.",
		);
	});
});
