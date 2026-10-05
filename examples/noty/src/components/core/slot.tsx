import {
	Children,
	cloneElement,
	isValidElement,
	type ReactNode,
	type Ref,
	type RefCallback,
} from "react";

type AnyProps = Record<string, unknown>;

export type SlotProps = AnyProps & {
	children?: ReactNode;
	ref?: Ref<unknown>;
};

/**
 * Renders its only child and merges its own props and ref onto it. Powers `asChild`.
 *
 * - Event handlers (`onPress`, `onLayout`…) are both called: the child's first, then the slot's.
 * - Styles are combined, the child's last so it can override. Style functions (`Pressable`) are supported.
 * - Other props: the child's value wins.
 */
export function Slot({ children, ref, ...props }: SlotProps) {
	const child = Children.only(children);
	if (!isValidElement<AnyProps>(child)) {
		throw new Error("Slot expects a single element as its child.");
	}

	const childRef = child.props.ref as Ref<unknown> | undefined;

	return cloneElement(child, {
		...mergeProps(props, child.props),
		ref: ref && childRef ? composeRefs(ref, childRef) : (ref ?? childRef),
	});
}

export function mergeProps(
	slotProps: AnyProps,
	childProps: AnyProps,
): AnyProps {
	const merged: AnyProps = { ...slotProps, ...childProps };

	for (const key of Object.keys(slotProps)) {
		const slotValue = slotProps[key];
		const childValue = childProps[key];

		if (
			/^on[A-Z]/.test(key) &&
			typeof slotValue === "function" &&
			typeof childValue === "function"
		) {
			merged[key] = (...args: unknown[]) => {
				childValue(...args);
				slotValue(...args);
			};
		} else if (key === "style" && childValue !== undefined) {
			merged.style = mergeStyles(slotValue, childValue);
		}
	}

	return merged;
}

function mergeStyles(slotStyle: unknown, childStyle: unknown) {
	if (typeof slotStyle !== "function" && typeof childStyle !== "function") {
		return [slotStyle, childStyle];
	}
	return (state: unknown) => [
		typeof slotStyle === "function" ? slotStyle(state) : slotStyle,
		typeof childStyle === "function" ? childStyle(state) : childStyle,
	];
}

export function composeRefs<T>(
	...refs: (Ref<T> | undefined)[]
): RefCallback<T> {
	return (node) => {
		const cleanups = refs.map((ref) => {
			if (typeof ref === "function") return ref(node);
			if (ref) ref.current = node;
		});
		return () => {
			cleanups.forEach((cleanup, i) => {
				const ref = refs[i];
				if (typeof cleanup === "function") cleanup();
				else if (typeof ref === "function") ref(null);
				else if (ref) ref.current = null;
			});
		};
	};
}
