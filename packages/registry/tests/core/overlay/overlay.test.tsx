import { render, screen, userEvent } from "@testing-library/react-native";

import { Overlay } from "@/components/core/overlay";

import { advance } from "../../utils/time";

jest.useFakeTimers();

describe("Overlay", () => {
	test("renders nothing while it has never been visible", async () => {
		await render(<Overlay visible={false} onPress={() => {}} />);

		expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
	});

	test("a dismissible overlay is a 'Close' button that calls onPress", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		await render(<Overlay visible onPress={onPress} />);

		await user.press(screen.getByRole("button", { name: "Close" }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test("takes a translated label", async () => {
		await render(<Overlay visible onPress={() => {}} accessibilityLabel="Fermer" />);

		expect(screen.getByRole("button", { name: "Fermer" })).toBeOnTheScreen();
	});

	test("without onPress, it blocks touches but stays out of the accessibility tree", async () => {
		await render(<Overlay visible />);

		expect(screen.queryByRole("button")).toBeNull();
	});

	test("hiding it plays the exit, then unmounts it and calls onExited", async () => {
		const onExited = jest.fn();
		const view = await render(
			<Overlay visible onPress={() => {}} onExited={onExited} />,
		);

		await view.rerender(<Overlay visible={false} onPress={() => {}} onExited={onExited} />);
		await advance(300);

		expect(onExited).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
	});

	test("ignores presses once it starts closing", async () => {
		const user = userEvent.setup();
		const onPress = jest.fn();
		const view = await render(<Overlay visible onPress={onPress} duration={10_000} />);
		const backdrop = screen.getByRole("button", { name: "Close" });

		await view.rerender(<Overlay visible={false} onPress={onPress} duration={10_000} />);
		await user.press(backdrop);

		expect(onPress).not.toHaveBeenCalled();
	});

	test("a newer onExited is the one called, without restarting the exit", async () => {
		const first = jest.fn();
		const second = jest.fn();
		const view = await render(<Overlay visible onExited={first} />);

		await view.rerender(<Overlay visible={false} onExited={first} />);
		await view.rerender(<Overlay visible={false} onExited={second} />);
		await advance(300);

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledTimes(1);
	});

	test("driven by progress, it leaves unmounting to its owner and reports the exit at once", async () => {
		const onExited = jest.fn();
		const progress = { get: () => 1, set: () => {} } as never;
		const view = await render(
			<Overlay visible progress={progress} onPress={() => {}} onExited={onExited} />,
		);

		await view.rerender(
			<Overlay visible={false} progress={progress} onPress={() => {}} onExited={onExited} />,
		);

		expect(onExited).toHaveBeenCalledTimes(1);
		expect(screen.getByRole("button", { name: "Close" })).toBeOnTheScreen();
	});

	test("the accessibility escape gesture dismisses it", async () => {
		const onPress = jest.fn();
		await render(<Overlay visible onPress={onPress} />);

		screen.getByRole("button", { name: "Close" }).props.onAccessibilityEscape();

		expect(onPress).toHaveBeenCalledTimes(1);
	});
});
