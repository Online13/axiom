import { createRef } from "react";
import { Pressable, Text, View } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";

import { composeRefs, mergeProps, Slot } from "@/components/core/slot";

import { pressIn } from "../../utils/events";

jest.useFakeTimers();

describe("Slot", () => {
	test("renders its child, not a wrapper, with the slot's props on it", async () => {
		await render(
			<Slot accessibilityLabel="Profile" testID="slot">
				<Pressable accessibilityRole="link">
					<Text>Ada</Text>
				</Pressable>
			</Slot>,
		);

		const link = screen.getByRole("link", { name: "Profile" });
		expect(link).toHaveProp("testID", "slot");
	});

	test("calls both press handlers, the child's first", async () => {
		const user = userEvent.setup();
		const calls: string[] = [];
		await render(
			<Slot onPress={() => calls.push("slot")}>
				<Pressable accessibilityRole="button" onPress={() => calls.push("child")}>
					<Text>Go</Text>
				</Pressable>
			</Slot>,
		);

		await user.press(screen.getByRole("button", { name: "Go" }));

		expect(calls).toEqual(["child", "slot"]);
	});

	test("the child's style overrides the slot's, and style functions see the press", async () => {
		await render(
			<Slot style={{ padding: 8, opacity: 1 }}>
				<Pressable
					accessibilityRole="button"
					style={({ pressed }) => ({ opacity: pressed ? 0.4 : 1 })}
				>
					<Text>Go</Text>
				</Pressable>
			</Slot>,
		);
		const button = screen.getByRole("button", { name: "Go" });

		expect(button).toHaveStyle({ padding: 8, opacity: 1 });
		await pressIn(button);
		expect(button).toHaveStyle({ padding: 8, opacity: 0.4 });
	});

	test("the child's other props win over the slot's", async () => {
		await render(
			<Slot accessibilityLabel="From slot">
				<View accessible accessibilityRole="header" accessibilityLabel="From child" />
			</Slot>,
		);

		expect(screen.getByRole("header", { name: "From child" })).toBeOnTheScreen();
	});

	test("forwards its ref and keeps the child's", async () => {
		const slotRef = createRef<View>();
		const childRef = createRef<View>();
		await render(
			<Slot ref={slotRef}>
				<View ref={childRef} testID="target" />
			</Slot>,
		);

		expect(slotRef.current).not.toBeNull();
		expect(slotRef.current).toBe(childRef.current);
	});

	test("throws when its child is not a single element", async () => {
		jest.spyOn(console, "error").mockImplementation(() => {});

		await expect(render(<Slot>plain text</Slot>)).rejects.toThrow();
		await expect(
			render(
				<Slot>
					<View />
					<View />
				</Slot>,
			),
		).rejects.toThrow();
	});
});

describe("mergeProps", () => {
	test("chains event handlers only when both sides have one", () => {
		const slot = jest.fn();
		const child = jest.fn();

		(mergeProps({ onLayout: slot }, { onLayout: child }).onLayout as (e: string) => void)("e");
		const onlySlot = mergeProps({ onPress: slot }, {});

		expect(child).toHaveBeenCalledWith("e");
		expect(slot).toHaveBeenCalledWith("e");
		expect(onlySlot.onPress).toBe(slot);
	});

	test("does not treat props that only start with 'on' as handlers", () => {
		const merged = mergeProps({ one: () => "slot" }, { one: () => "child" });

		expect((merged.one as () => string)()).toBe("child");
	});

	test("joins class names, the child's last", () => {
		expect(mergeProps({ className: "p-4" }, { className: "bg-red" }).className).toBe(
			"p-4 bg-red",
		);
	});

	test("keeps the slot's style when the child has none", () => {
		const style = { margin: 2 };
		expect(mergeProps({ style }, {}).style).toBe(style);
	});

	test("resolves a style function on either side with the same state", () => {
		const merged = mergeProps(
			{ style: ({ pressed }: { pressed: boolean }) => ({ opacity: pressed ? 0 : 1 }) },
			{ style: { margin: 1 } },
		);

		expect((merged.style as (s: unknown) => unknown)({ pressed: true })).toEqual([
			{ opacity: 0 },
			{ margin: 1 },
		]);
	});
});

describe("composeRefs", () => {
	test("sets every ref, then clears them all on cleanup", () => {
		const object = createRef<string>();
		const callback = jest.fn();

		const cleanup = composeRefs<string>(object, callback, undefined)("node");
		expect(object.current).toBe("node");
		expect(callback).toHaveBeenCalledWith("node");

		(cleanup as () => void)();
		expect(object.current).toBeNull();
		expect(callback).toHaveBeenLastCalledWith(null);
	});

	test("runs a callback ref's own cleanup instead of calling it with null", () => {
		const cleanupFn = jest.fn();
		const callback = jest.fn(() => cleanupFn);

		const cleanup = composeRefs<string>(callback)("node");
		(cleanup as () => void)();

		expect(cleanupFn).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledTimes(1);
	});
});
