/**
 * Joins class names, skipping the falsy ones: `cx("flex-row", active && "opacity-50", className)`.
 *
 * A component writes its own classes first and the caller's `className` last. Two utilities that set
 * the same property don't override each other by order in Tailwind, so to replace one of a
 * component's own values, pass `style`: it always wins.
 */
export function cx(...classes: (string | false | null | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}
