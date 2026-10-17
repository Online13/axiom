import { act, renderHook } from "@testing-library/react-native";

import { useControllableState } from "@/hooks/use-controllable-state";

describe("useControllableState", () => {
	describe("uncontrolled", () => {
		test("starts from defaultValue and keeps what is set", async () => {
			const onChange = jest.fn();
			const { result } = await renderHook(() =>
				useControllableState({ defaultValue: 1, onChange }),
			);

			expect(result.current[0]).toBe(1);
			await act(() => result.current[1](2));

			expect(result.current[0]).toBe(2);
			expect(onChange).toHaveBeenCalledWith(2);
		});

		test("setting the current value again is not a change", async () => {
			const onChange = jest.fn();
			const { result } = await renderHook(() =>
				useControllableState({ defaultValue: "a", onChange }),
			);

			await act(() => result.current[1]("a"));

			expect(onChange).not.toHaveBeenCalled();
		});

		test("a later defaultValue is ignored: it is only the initial value", async () => {
			const { result, rerender } = await renderHook(
				(props: { defaultValue: number }) => useControllableState(props),
				{ initialProps: { defaultValue: 1 } },
			);

			await rerender({ defaultValue: 5 });

			expect(result.current[0]).toBe(1);
		});

		test("NaN set twice counts as one change (Object.is)", async () => {
			const onChange = jest.fn();
			const { result } = await renderHook(() =>
				useControllableState({ defaultValue: 0, onChange }),
			);

			await act(() => result.current[1](NaN));
			await act(() => result.current[1](NaN));

			expect(onChange).toHaveBeenCalledTimes(1);
		});
	});

	describe("controlled", () => {
		test("shows value and only asks the owner to change it", async () => {
			const onChange = jest.fn();
			const { result } = await renderHook(() =>
				useControllableState({ value: false, defaultValue: true, onChange }),
			);

			expect(result.current[0]).toBe(false);
			await act(() => result.current[1](true));

			expect(onChange).toHaveBeenCalledWith(true);
			expect(result.current[0]).toBe(false);
		});

		test("follows the owner's value", async () => {
			const { result, rerender } = await renderHook(
				(props: { value: string }) =>
					useControllableState({ value: props.value, defaultValue: "x" }),
				{ initialProps: { value: "a" } },
			);

			await rerender({ value: "b" });

			expect(result.current[0]).toBe("b");
		});

		test("null is a controlled value, unlike undefined", async () => {
			const { result } = await renderHook(() =>
				useControllableState<string | null>({ value: null, defaultValue: "fallback" }),
			);

			expect(result.current[0]).toBeNull();
		});

		test("becoming uncontrolled continues from the last uncontrolled state", async () => {
			const { result, rerender } = await renderHook(
				(props: { value?: number }) =>
					useControllableState({ value: props.value, defaultValue: 0 }),
				{ initialProps: { value: 7 } as { value?: number } },
			);

			await rerender({ value: undefined });

			expect(result.current[0]).toBe(0);
		});
	});
});
