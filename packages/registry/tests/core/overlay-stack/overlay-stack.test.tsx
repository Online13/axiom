import { Text } from "react-native";
import { render, screen } from "@testing-library/react-native";

import { MAX_OVERLAY_DEPTH, useOverlayStack } from "@/components/core/overlay-stack";

function Surface({ name, open, pushes }: { name: string; open: boolean; pushes?: boolean }) {
	const { depth, isTop } = useOverlayStack(open, pushes);
	return <Text testID={name}>{`${depth}:${isTop ? "top" : "below"}`}</Text>;
}

function Stack({ open, pushes = {} }: { open: string[]; pushes?: Record<string, boolean> }) {
	return (
		<>
			{["a", "b", "c", "d"].map((name) => (
				<Surface key={name} name={name} open={open.includes(name)} pushes={pushes[name]} />
			))}
		</>
	);
}

const position = (name: string) => screen.getByTestId(name);

describe("useOverlayStack", () => {
	test("a closed surface sits nowhere", async () => {
		await render(<Stack open={[]} />);

		expect(position("a")).toHaveTextContent("0:below");
	});

	test("a single open surface is on top, at depth 0", async () => {
		await render(<Stack open={["a"]} />);

		expect(position("a")).toHaveTextContent("0:top");
	});

	test("each surface opened above pushes the ones below back", async () => {
		const view = await render(<Stack open={["a"]} />);
		await view.rerender(<Stack open={["a", "b"]} />);

		expect(position("a")).toHaveTextContent("1:below");
		expect(position("b")).toHaveTextContent("0:top");
	});

	test(`depth stops at MAX_OVERLAY_DEPTH (${MAX_OVERLAY_DEPTH})`, async () => {
		const view = await render(<Stack open={["a"]} />);
		await view.rerender(<Stack open={["a", "b"]} />);
		await view.rerender(<Stack open={["a", "b", "c"]} />);
		await view.rerender(<Stack open={["a", "b", "c", "d"]} />);

		expect(position("a")).toHaveTextContent(`${MAX_OVERLAY_DEPTH}:below`);
		expect(position("b")).toHaveTextContent("2:below");
		expect(position("c")).toHaveTextContent("1:below");
		expect(position("d")).toHaveTextContent("0:top");
	});

	test("closing the top surface gives the spot back to the one below", async () => {
		const view = await render(<Stack open={["a"]} />);
		await view.rerender(<Stack open={["a", "b"]} />);
		await view.rerender(<Stack open={["a"]} />);

		expect(position("a")).toHaveTextContent("0:top");
		expect(position("b")).toHaveTextContent("0:below");
	});

	test("closing a surface in the middle keeps the order of the others", async () => {
		const view = await render(<Stack open={["a"]} />);
		await view.rerender(<Stack open={["a", "b"]} />);
		await view.rerender(<Stack open={["a", "b", "c"]} />);
		await view.rerender(<Stack open={["a", "c"]} />);

		expect(position("a")).toHaveTextContent("1:below");
		expect(position("c")).toHaveTextContent("0:top");
	});

	test("a surface that doesn't push takes the top without pushing the others back", async () => {
		const view = await render(<Stack open={["a"]} pushes={{ b: false }} />);
		await view.rerender(<Stack open={["a", "b"]} pushes={{ b: false }} />);

		expect(position("a")).toHaveTextContent("0:below");
		expect(position("b")).toHaveTextContent("0:top");
	});

	test("unmounting an open surface removes it from the stack", async () => {
		const view = await render(<Stack open={["a"]} />);
		await view.rerender(<Stack open={["a", "b"]} />);
		await view.rerender(<Surface name="a" open />);

		expect(position("a")).toHaveTextContent("0:top");
	});
});
