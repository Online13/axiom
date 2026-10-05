import { useState } from "react";

export type UseControllableStateOptions<T> = {
	/** Controlled value. When set, the owner decides and `onChange` asks it to change. */
	value?: T;
	/** Initial value when the component manages its own state. */
	defaultValue: T;
	onChange?: (value: T) => void;
};

/**
 * The `value` / `defaultValue` / `onValueChange` pattern shared by every input:
 * controlled when `value` is set, uncontrolled otherwise.
 */
export function useControllableState<T>({
	value,
	defaultValue,
	onChange,
}: UseControllableStateOptions<T>) {
	const [uncontrolled, setUncontrolled] = useState(defaultValue);
	const controlled = value !== undefined;
	const current = controlled ? value : uncontrolled;

	const setValue = (next: T) => {
		if (!controlled) setUncontrolled(next);
		if (!Object.is(next, current)) onChange?.(next);
	};

	return [current, setValue] as const;
}
